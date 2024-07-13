const Vin = require('../model/vin');

// Fonction pour générer le numéro de vin avec format VIN0001, VIN0002, etc.
async function generateNextVinId() {
    try {
        const lastVin = await Vin.findOne({}, {}, { sort: { 'num_vin': -1 } });
        let nextId = 1;
        if (lastVin) {
            const lastId = parseInt(lastVin.num_vin.split('VIN')[1]);
            nextId = lastId + 1;
        }
        const newVinId = 'VIN' + String(nextId).padStart(4, '0'); // Remplir avec des zéros à gauche pour obtenir 4 chiffres
        return newVinId;
    } catch (error) {
        console.error("Error generating vin ID:", error);
        throw error;
    }
}

exports.create = async (req, res) => {
    try {
        // Vérifier si toutes les données requises sont présentes dans la requête
        const requiredFields = ['nom', 'cepages', 'appellation', 'teneur_alcool', 'description', 'prix', 'type'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).send({
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Générer le numéro de vin
        const num_vin = await generateNextVinId();

        // Créer un nouveau vin avec les données fournies dans la requête
        const vin = new Vin({
            num_vin: num_vin,
            nom: req.body.nom,
            cepages: req.body.cepages,
            appellation: req.body.appellation,
            teneur_alcool: req.body.teneur_alcool,
            description: req.body.description,
            prix: req.body.prix,
            photo: req.body.photo,
            type: req.body.type,
            quantite: 0
        });

        // Enregistrer le vin dans la base de données
        const savedVin = await vin.save();

        // Envoyer une réponse avec le vin créé
        res.status(201).send({
            message: "Vin created successfully!",
            vin: savedVin
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: error.message || "Some error occurred while creating vin"
        });
    }
};


// Les autres méthodes CRUD (findAll, findOne, update, delete) restent inchangées


exports.findAll = async (req, res) => {
    try {
        const vins = await Vin.find();
        res.status(200).json(vins);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.findOne = async (req, res) => {
    try {
        const vin = await Vin.findOne({ num_vin: req.params.num_vin });
        if (!vin) {
            return res.status(404).send({ message: "Vin not found with number " + req.params.num_vin });
        }
        res.status(200).json(vin);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving vin with number " + req.params.num_vin });
    }
};

exports.update = async (req, res) => {
    try {
        const updatedVin = await Vin.findOneAndUpdate({ num_vin: req.params.num_vin }, req.body, { new: true });
        if (!updatedVin) {
            return res.status(404).send({ message: "Vin not found with number " + req.params.num_vin });
        }
        res.status(200).json(updatedVin);
    } catch (error) {
        res.status(500).json({ message: "Error updating vin with number " + req.params.num_vin });
    }
};

exports.delete = async (req, res) => {
    try {
        const deletedVin = await Vin.findOneAndDelete({ num_vin: req.params.num_vin });
        if (!deletedVin) {
            return res.status(404).send({ message: "Vin not found with number " + req.params.num_vin });
        }
        res.status(200).json({ message: "Vin deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting vin with number " + req.params.num_vin });
    }
};

exports.countByType = async (req, res) => {
    try {
        const sumQuantiteByVin = await Vin.aggregate([
            {
                $group: {
                    _id: "$type",
                    totalQuantite: { $sum: "$quantite" }
                }
            }
        ]);

        res.status(200).json(sumQuantiteByVin);
    } catch (error) {
        console.error("Error summing quantite by vin:", error);
        res.status(500).json({ message: "Error summing quantite by vin" });
    }
};

// Rechercher des vins en fonction du type, de l'intervalle de prix et de l'intervalle de teneur en alcool
exports.search = async (req, res) => {
    try {
        const { type, prixMin, prixMax, teneurAlcoolMin, teneurAlcoolMax } = req.body;

        // Construire le filtre de recherche en fonction des valeurs reçues
        const filter = { type };
        if (prixMin !== undefined && prixMax !== undefined) {
            filter.prix = { $gte: prixMin, $lte: prixMax };
        }
        if (teneurAlcoolMin !== undefined && teneurAlcoolMax !== undefined) {
            filter.teneur_alcool = { $gte: teneurAlcoolMin, $lte: teneurAlcoolMax };
        }

        // Exécuter la requête de recherche en utilisant le filtre
        const vins = await Vin.find(filter);

        res.status(200).json(vins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la recherche de vins." });
    }
};