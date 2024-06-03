const Vente = require('../model/vente');
const Client = require('../model/client');
const Vin = require('../model/vin');

// Fonction pour générer un nouvel identifiant de vente
async function generateNextVenteId() {
    try {
        const lastVente = await Vente.findOne({}, {}, { sort: { 'num_vente': -1 } });
        let nextId = 1;
        if (lastVente) {
            const lastId = parseInt(lastVente.num_vente.split('VNT')[1]);
            nextId = lastId + 1;
        }
        const newVenteId = 'VNT' + String(nextId).padStart(4, '0');
        return newVenteId;
    } catch (error) {
        console.error("Error generating vente ID:", error);
        throw error;
    }
}

// Créer une nouvelle vente
exports.create = async (req, res) => {
    try {
        const { date, client, mode_paiement, vins } = req.body;
        
        // Recherche du client par son numéro
        const existingClient = await Client.findOne({ num_client: client.num_client });
        if (!existingClient) {
            return res.status(400).json({ message: "Le client n'existe pas." });
        }

        let montant_total = 0;
        const vinsDetails = [];

        for (const vinItem of vins) {
            // Recherche du vin par son numéro
            const existingVin = await Vin.findOne({ num_vin: vinItem.num_vin });
            if (!existingVin) {
                return res.status(400).json({ message: `Le vin avec le numéro ${vinItem.num_vin} n'existe pas.` });
            }

            // Vérification de la disponibilité en stock
            if (existingVin.quantite < vinItem.quantite) {
                return res.status(400).json({ message: `Quantité insuffisante en stock pour le vin ${vinItem.num_vin}.` });
            }

            // Calcul du montant total pour ce vin
            montant_total += existingVin.prix * vinItem.quantite;

            // Soustraction de la quantité vendue du stock de vin
            existingVin.quantite -= vinItem.quantite;
            await existingVin.save();

            vinsDetails.push({ vin: existingVin._id, quantite: vinItem.quantite });
        }

        const num_vente = await generateNextVenteId();

        const vente = new Vente({ 
            num_vente, 
            date, 
            client: existingClient._id, 
            mode_paiement, 
            vins: vinsDetails, 
            montant_total 
        });
        const savedVente = await vente.save();
        res.status(201).json(savedVente);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la création de la vente." });
    }
};

exports.findAll = async (req, res) => {
    try {
        const ventes = await Vente.find().populate('client').populate('vins.vin');
        res.status(200).json(ventes);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.findOne = async (req, res) => {
    try {
        const vente = await Vente.findOne({ num_vente: req.params.num_vente }).populate('client').populate('vins.vin');
        if (!vente) {
            return res.status(404).send({ message: "Vente non trouvée avec le numéro " + req.params.num_vente });
        }
        res.status(200).json(vente);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la vente avec le numéro " + req.params.num_vente });
    }
};

exports.update = async (req, res) => {
    try {
        const { date, client, mode_paiement, vins, montant_total } = req.body;
        
        // Recherche de la vente à mettre à jour
        const updatedVente = await Vente.findOneAndUpdate({ num_vente: req.params.num_vente }, 
            { date, client, mode_paiement, vins, montant_total }, 
            { new: true }
        ).populate('client').populate('vins.vin');
        
        if (!updatedVente) {
            return res.status(404).send({ message: "Vente non trouvée avec le numéro " + req.params.num_vente });
        }
        
        res.status(200).json(updatedVente);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la vente avec le numéro " + req.params.num_vente });
    }
};

exports.delete = async (req, res) => {
    try {
        const deletedVente = await Vente.findOneAndDelete({ num_vente: req.params.num_vente });
        if (!deletedVente) {
            return res.status(404).send({ message: "Vente non trouvée avec le numéro " + req.params.num_vente });
        }
        res.status(200).json({ message: "Vente supprimée avec succès!" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la vente avec le numéro " + req.params.num_vente });
    }
};

// Calculer le chiffre d'affaires et le nombre de bouteilles vendues
exports.getSalesStats = async (req, res) => {
    try {
        const totalSales = await Vente.aggregate([
            { $unwind: "$vins" },
            {
                $group: {
                    _id: null,
                    totalMontant: { $sum: "$montant_total" },
                    totalQuantite: { $sum: "$vins.quantite" }
                }
            }
        ]);

        if (totalSales.length === 0) {
            return res.status(404).json({ message: "Aucune vente trouvée." });
        }

        res.status(200).json({
            chiffreAffaires: totalSales[0].totalMontant,
            nombreBouteillesVendues: totalSales[0].totalQuantite
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du calcul du chiffre d'affaires et du nombre de bouteilles vendues." });
    }
};

exports.getSalesByMonth = async (req, res) => {
    try {
        const salesByMonth = await Vente.aggregate([
            { $unwind: "$vins" },
            {
                $project: {
                    month: { $month: '$date' },
                    year: { $year: '$date' },
                    quantite: "$vins.quantite"
                }
            },
            {
                $group: {
                    _id: { month: '$month', year: '$year' },
                    totalQuantite: { $sum: '$quantite' }
                }
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1
                }
            }
        ]);

        // Mapper les numéros de mois en format abrégé
        const salesByMonthFormatted = salesByMonth.map(item => {
            const monthNames = ["", "jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"];
            return {
                _id: {
                    month: monthNames[item._id.month],
                    year: item._id.year
                },
                totalQuantite: item.totalQuantite
            };
        });

        res.status(200).json(salesByMonthFormatted);
    } catch (error) {
        console.error("Error retrieving sales by month:", error);
        res.status(500).json({ message: "Erreur lors de la récupération du nombre de ventes par mois." });
    }
};

// Ajouter une fonction pour récupérer les détails de chaque vin par nom
exports.getVinsDetailsByName = async (req, res) => {
    try {
        const vente = await Vente.findOne({ num_vente: req.params.num_vente }).populate('vins.vin');
        if (!vente) {
            return res.status(404).send({ message: "Vente non trouvée avec le numéro " + req.params.num_vente });
        }

        // Récupérer les détails de chaque vin vendu par nom
        const vinsDetails = [];
        for (const vinItem of vente.vins) {
            const vinDetails = await Vin.findOne({ nom: vinItem.nom });
            if (vinDetails) {
                vinsDetails.push({
                    nom: vinDetails.nom,
                    type: vinDetails.type,
                    cepages: vinDetails.cepages,
                    appellation: vinDetails.appellation,
                    teneur_alcool: vinDetails.teneur_alcool,
                    description: vinDetails.description,
                    prix: vinDetails.prix,
                    photo: vinDetails.photo,
                    quantite: vinItem.quantite
                });
            }
        }

        res.status(200).json(vinsDetails);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des détails des vins pour la vente avec le numéro " + req.params.num_vente });
    }
};
