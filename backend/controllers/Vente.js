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
        const { date, client, mode_paiement, vin, quantite_vendue } = req.body;
        
        // Recherche du client par son numéro
        const existingClient = await Client.findOne({ num_client: client.num_client });
        if (!existingClient) {
            return res.status(400).json({ message: "Le client n'existe pas." });
        }

        // Recherche du vin par son numéro
        const existingVin = await Vin.findOne({ num_vin: vin.num_vin });
        if (!existingVin) {
            return res.status(400).json({ message: "Le vin n'existe pas." });
        }

        // Vérification de la disponibilité en stock
        if (existingVin.quantite < quantite_vendue) {
            return res.status(400).json({ message: "Quantité insuffisante en stock." });
        }

        // Calcul du montant total
        const montant_total = existingVin.prix * quantite_vendue;

        // Soustraction de la quantité vendue du stock de vin
        existingVin.quantite -= quantite_vendue;
        await existingVin.save();

        const num_vente = await generateNextVenteId();

        const vente = new Vente({ 
            num_vente, 
            date, 
            client: existingClient._id, 
            mode_paiement, 
            vin: existingVin._id, 
            quantite_vendue, 
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
        const ventes = await Vente.find();
        res.status(200).json(ventes);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.findOne = async (req, res) => {
    try {
        const vente = await Vente.findOne({ num_vente: req.params.num_vente });
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
        const updatedVente = await Vente.findOneAndUpdate({ num_vente: req.params.num_vente }, req.body, { new: true });
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
            {
                $group: {
                    _id: null,
                    totalMontant: { $sum: "$montant_total" },
                    totalQuantite: { $sum: "$quantite_vendue" }
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
            {
                $project: {
                    month: { $month: '$date' },
                    year: { $year: '$date' },
                    quantite_vendue: 1 
                }
            },
            {
                $group: {
                    _id: { month: '$month', year: '$year' },
                    totalQuantite: { $sum: '$quantite_vendue' } 
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
