const Production = require('../model/production');
const Vin = require('../model/vin');

// Fonction pour générer le numéro de production avec format PROD0001, PROD0002, etc.
function generateProductionNumber(nextId) {
    const paddedId = String(nextId).padStart(4, '0'); // Remplir avec des zéros à gauche pour obtenir 4 chiffres
    return 'PROD' + paddedId;
}

// Créer une nouvelle production
exports.create = async (req, res) => {
    try {
        const { vin, quantite, date_prod, region } = req.body;

        // Vérifier si le vin existe
        const existingVin = await Vin.findOne({ num_vin: vin.num_vin });
        if (!existingVin) {
            return res.status(400).json({ message: "Le vin n'existe pas." });
        }
        
        // Trouver le dernier production enregistré pour obtenir le prochain numéro de production
        const lastProduction = await Production.findOne({}, {}, { sort: { 'num_prod': -1 } });
        let nextId = 1;
        if (lastProduction) {
            const lastId = parseInt(lastProduction.num_prod.split('PROD')[1]);
            nextId = lastId + 1;
        }
        const num_prod = generateProductionNumber(nextId);

        // Enregistrer la production
        const production = new Production({ num_prod, vin: existingVin._id, quantite, date_prod, region });
        const savedProduction = await production.save();

        // Mettre à jour la quantité dans le modèle de vin
        existingVin.quantite += quantite;
        await existingVin.save();

        res.status(201).json(savedProduction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la création de la production." });
    }
};
// Lister toutes les productions
exports.findAll = async (req, res) => {
    try {
        const productions = await Production.find();
        res.status(200).json(productions);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Trouver une production par son numéro de production
exports.findOne = async (req, res) => {
    try {
        const production = await Production.findOne({ num_prod: req.params.num_prod });
        if (!production) {
            return res.status(404).send({ message: "Production non trouvée avec le numéro " + req.params.num_prod });
        }
        res.status(200).json(production);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la production avec le numéro " + req.params.num_prod });
    }
};

// Mettre à jour une production par son numéro de production
exports.update = async (req, res) => {
    try {
        const updatedProduction = await Production.findOneAndUpdate({ num_prod: req.params.num_prod }, req.body, { new: true });
        if (!updatedProduction) {
            return res.status(404).send({ message: "Production non trouvée avec le numéro " + req.params.num_prod });
        }
        res.status(200).json(updatedProduction);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la production avec le numéro " + req.params.num_prod });
    }
};

// Supprimer une production par son numéro de production
exports.delete = async (req, res) => {
    try {
        const deletedProduction = await Production.findOneAndDelete({ num_prod: req.params.num_prod });
        if (!deletedProduction) {
            return res.status(404).send({ message: "Production non trouvée avec le numéro " + req.params.num_prod });
        }
        res.status(200).json({ message: "Production supprimée avec succès!" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la production avec le numéro " + req.params.num_prod });
    }
};

// Calculer le total de vin produit
exports.getTotalblushProduced = async (req, res) => {
    try {
        const totalProduced = await Production.aggregate([
            {
                $group: {
                    _id: null,
                    totalQuantite: { $sum: "$quantite" }
                }
            }
        ]);

        if (totalProduced.length === 0) {
            return res.status(404).json({ message: "Aucune production trouvée." });
        }

        res.status(200).json({
            totalQuantiteProduite: totalProduced[0].totalQuantite
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du calcul du total de vin produit." });
    }
};
// Calculer le nombre de productions par mois
exports.getProductionByMonth = async (req, res) => {
    try {
        const productionByMonth = await Production.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: "$date_prod" },
                        year: { $year: "$date_prod" }
                    },
                    totalQuantite: { $sum: "$quantite" }
                }
            },
            {
                $sort: { "_id.month": 1 } 
            }
        ]);

        if (productionByMonth.length === 0) {
            return res.status(404).json({ message: "Aucune production trouvée." });
        }

        const productionByMonthFormatted = productionByMonth.map(item => {
            const monthNames = ["", "jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"];
            return {
                _id: {
                    month: monthNames[item._id.month],
                    year: item._id.year
                },
                totalQuantite: item.totalQuantite
            };
        });

        res.status(200).json(productionByMonthFormatted);
    } catch (error) {
        console.error("Error retrieving production by month:", error);
        res.status(500).json({ message: "Erreur lors du calcul du nombre de productions par mois." });
    }
};
