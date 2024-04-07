const Client = require('../model/client');
// Fonction pour générer le numéro de client avec format CLT0001, CLT0002, etc.
function generateClientNumber(nextId) {
    const paddedId = String(nextId).padStart(4, '0'); // Remplir avec des zéros à gauche pour obtenir 4 chiffres
    return 'CLT' + paddedId;
}

// Créer un nouveau client
exports.create = async (req, res) => {
    try {
        const { nom, adresse, email, telephone } = req.body;
        
        // Trouver le dernier client enregistré pour obtenir le prochain numéro de client
        const lastClient = await Client.findOne({}, {}, { sort: { 'num_client': -1 } });
        let nextId = 1;
        if (lastClient) {
            const lastId = parseInt(lastClient.num_client.split('CLT')[1]); // Extraire l'ID numérique
            nextId = lastId + 1;
        }
        const num_client = generateClientNumber(nextId);

        // Créer le nouveau client
        const client = new Client({ num_client, nom, adresse, email, telephone });
        const savedClient = await client.save();
        res.status(201).json(savedClient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la création du client." });
    }
};

// Lister tous les clients
exports.findAll = async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Trouver un client par son numéro de client
exports.findOne = async (req, res) => {
    try {
        const client = await Client.findOne({ num_client: req.params.num_client });
        if (!client) {
            return res.status(404).send({ message: "Client non trouvé avec le numéro " + req.params.num_client });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du client avec le numéro " + req.params.num_client });
    }
};

// Mettre à jour un client par son numéro de client
exports.update = async (req, res) => {
    try {
        const updatedClient = await Client.findOneAndUpdate({ num_client: req.params.num_client }, req.body, { new: true });
        if (!updatedClient) {
            return res.status(404).send({ message: "Client non trouvé avec le numéro " + req.params.num_client });
        }
        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du client avec le numéro " + req.params.num_client });
    }
};

// Supprimer un client par son numéro de client
exports.delete = async (req, res) => {
    try {
        const deletedClient = await Client.findOneAndDelete({ num_client: req.params.num_client });
        if (!deletedClient) {
            return res.status(404).send({ message: "Client non trouvé avec le numéro " + req.params.num_client });
        }
        res.status(200).json({ message: "Client supprimé avec succès!" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du client avec le numéro " + req.params.num_client });
    }
};
