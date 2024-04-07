const Client = require('../model/client');
const Vente = require('../model/vente');
const Vin = require('../model/vin');

exports.createClientVenteVendre = async (req, res) => {
    try {
        const { clientInfo, venteInfo } = req.body;

        // Générer le numéro de client avec CL comme préfixe
        const lastClient = await Client.findOne({}, {}, { sort: { 'num_client': -1 } });
        let nextClientId = 1;
        if (lastClient) {
            const lastClientId = parseInt(lastClient.num_client.split('CLT')[1]);
            nextClientId = lastClientId + 1;
        }
        const num_client = 'CLT' + nextClientId;

        // Création du client
        const client = new Client({ ...clientInfo, num_client });
        const savedClient = await client.save();

        // Générer le numéro de vente avec VNT comme préfixe
        const lastVente = await Vente.findOne({}, {}, { sort: { 'num_vente': -1 } });
        let nextVenteId = 1;
        if (lastVente) {
            const lastVenteId = parseInt(lastVente.num_vente.split('VNT')[1]);
            nextVenteId = lastVenteId + 1;
        }
        const num_vente = 'VNT' + nextVenteId;

        // Récupérer le prix du vin et la quantité en stock
        const { num_vin, quantite_vendue } = venteInfo;
        const vin = await Vin.findOne({ num_vin });
        if (!vin) {
            return res.status(400).json({ message: "Le vin spécifié n'existe pas." });
        }

        // Vérifier si la quantité en stock est suffisante
        if (vin.quantite < quantite_vendue) {
            return res.status(400).json({ message: "La quantité en stock est insuffisante pour cette vente." });
        }

        // Calculer le montant total
        const montant_total = quantite_vendue * vin.prix;

        // Création de la vente
        const vente = new Vente({ 
            ...venteInfo, 
            num_vente, 
            client: savedClient._id,
            vin: vin._id, // Ajouter la référence au vin
            quantite_vendue, // Ajouter la quantité vendue
            montant_total // Ajouter le montant total
        });
        const savedVente = await vente.save();

        // Mise à jour de la quantité en stock du vin
        vin.quantite -= quantite_vendue;
        await vin.save();

        res.status(201).json({ savedClient, savedVente });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyValue) {
            return res.status(400).json({ message: `Le numéro de client "${error.keyValue.num_client}" est déjà utilisé. Veuillez réessayer avec un autre numéro de client.` });
        }
        
        console.error(error);
        res.status(500).json({ message: error.message || "Une erreur s'est produite lors de la création du client et de la vente." });
    }
};
