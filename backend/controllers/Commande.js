const Commande = require('../model/commande');
const Client = require('../model/client');
const Vin = require('../model/vin');

// Fonction pour générer un nouvel identifiant de commande
async function generateNextCommandeId() {
    try {
        const lastCommande = await Commande.findOne({}, {}, { sort: { 'num_commande': -1 } });
        let nextId = 1;
        if (lastCommande) {
            const lastId = parseInt(lastCommande.num_commande.split('CMD')[1]);
            nextId = lastId + 1;
        }
        const newCommandeId = 'CMD' + String(nextId).padStart(4, '0');
        return newCommandeId;
    } catch (error) {
        console.error("Error generating commande ID:", error);
        throw error;
    }
}

// Créer une nouvelle commande
exports.create = async (req, res) => {
    try {
        const { date, client, mode_paiement, vin, paiement, statut, quantite_vendue } = req.body;
        
        const existingClient = await Client.findOne({ num_client: client.num_client });
        if (!existingClient) {
            return res.status(400).json({ message: "Le client n'existe pas." });
        }

        const existingVin = await Vin.findOne({ num_vin: vin.num_vin });
        if (!existingVin) {
            return res.status(400).json({ message: "Le vin n'existe pas." });
        }
        
        if (existingVin.quantite < quantite_vendue) {
            return res.status(400).json({ message: "Quantité insuffisante en stock." });
        }

    
        const montant_total = existingVin.prix * quantite_vendue;

        existingVin.quantite -= quantite_vendue;
        await existingVin.save();

        const num_commande = await generateNextCommandeId();

        const commande = new Commande({ 
            num_commande, 
            date, 
            client: existingClient._id, 
            mode_paiement, 
            vin: existingVin._id, 
            paiement,
            statut,
            quantite_vendue, 
            montant_total 
        });
        const savedCommande = await commande.save();
        res.status(201).json(savedCommande);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la création de la commande." });
    }
};
exports.findAll = async (req, res) => {
    try {
        const commandes = await Commande.find();
        res.status(200).json(commandes);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.findOne = async (req, res) => {
    try {
        const commande = await Commande.findOne({ num_commande: req.params.num_commande });
        if (!commande) {
            return res.status(404).send({ message: "Commande non trouvée avec le numéro " + req.params.num_commande });
        }
        res.status(200).json(commande);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la commande avec le numéro " + req.params.num_commande });
    }
};

exports.update = async (req, res) => {
    try {
        const updatedCommande = await Commande.findOneAndUpdate({ num_commande: req.params.num_commande }, req.body, { new: true });
        if (!updatedCommande) {
            return res.status(404).send({ message: "Commande non trouvée avec le numéro " + req.params.num_commande });
        }
        res.status(200).json(updatedCommande);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la commande avec le numéro " + req.params.num_commande });
    }
};

exports.delete = async (req, res) => {
    try {
        const deletedCommande = await Commande.findOneAndDelete({ num_commande: req.params.num_commande });
        if (!deletedCommande) {
            return res.status(404).send({ message: "Commande non trouvée avec le numéro " + req.params.num_commande });
        }
        res.status(200).json({ message: "Commande supprimée avec succès!" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la commande avec le numéro " + req.params.num_commande });
    }
};
// Calculer le chiffre d'affaires et le nombre de bouteilles vendues
exports.getSalesStats = async (req, res) => {
    try {
        const totalSales = await Commande.aggregate([
            {
                $group: {
                    _id: null,
                    totalMontant: { $sum: "$montant_total" },
                    totalQuantite: { $sum: "$quantite_vendue" }
                }
            }
        ]);

        if (totalSales.length === 0) {
            return res.status(404).json({ message: "Aucune commande trouvée." });
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
        const salesByMonth = await Commande.aggregate([
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
        res.status(500).json({ message: "Erreur lors de la récupération du nombre de commandes par mois." });
    }
};

