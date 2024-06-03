const Commande = require('../model/commande');
const Client = require('../model/client');
const Vin = require('../model/vin');
const Vente = require('../model/vente');
const mongoose = require('mongoose');

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

// Créer une nouvelle commande
// Créer une nouvelle commande
exports.create = async (req, res) => {
    try {
        const { date, client, vins, paiement, statut } = req.body;

        // Validate client ID
        if (typeof client.num_client !== 'string') {
            return res.status(400).json({ message: "ID du client invalide." });
        }

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

            // Vérification de la quantité de vin
            const quantite = parseFloat(vinItem.quantite);
            if (isNaN(quantite) || quantite <= 0) {
                return res.status(400).json({ message: `Quantité de vin invalide pour le vin ${vinItem.num_vin}.` });
            }

            // Vérification de la disponibilité en stock
            if (existingVin.quantite < quantite) {
                return res.status(400).json({ message: `Quantité insuffisante en stock pour le vin ${vinItem.num_vin}.` });
            }

            // Calcul du montant total pour ce vin
            montant_total += existingVin.prix * quantite;

            // Soustraction de la quantité vendue du stock de vin
            existingVin.quantite -= quantite;
            await existingVin.save();

            vinsDetails.push({ vin: existingVin._id, quantite });
        }

        const num_commande = await generateNextCommandeId();

        const commande = new Commande({
            num_commande,
            date,
            client: existingClient._id,
            vins: vinsDetails,
            montant_total,
            statut,
            paiement
        });

        const savedCommande = await commande.save();

        if (paiement === 'payé') {
            const ventePromises = vins.map(async (item) => {
                const num_vente = await generateNextVenteId();
                const vente = new Vente({
                    num_vente,
                    date,
                    client: existingClient._id,
                    vin: item.num_vin,
                    quantite_vendue: item.quantite_vendue,
                    montant_total: montant_total
                });
                return vente.save();
            });
            await Promise.all(ventePromises);
        }

        res.status(201).json(savedCommande);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
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
                    totalQuantite: { $sum: "$vins.quantite_vendue" }
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

// Obtenir les ventes par mois
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
                    totalQuantite: { $sum: '$vins.quantite_vendue' } 
                }
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1
                }
            }
        ]);

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
