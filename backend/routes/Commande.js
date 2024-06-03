const express = require('express');
const router = express.Router();
const session = require('express-session');
const commandeController = require('../controllers/Commande');
const Vin = require('../model/vin');
const Client = require('../model/client'); // Importer le modèle Client
const Commande = require('../model/commande'); // Assurez-vous d'importer le modèle Commande

router.use(session({
    secret: 'secret', // Changez ceci par une chaîne aléatoire pour sécuriser vos sessions
    resave: false,
    saveUninitialized: true
}));

// Route pour obtenir les ventes par mois
router.get('/month', commandeController.getSalesByMonth);

// Route pour créer une nouvelle commande
router.post('/', commandeController.create);

// Route pour obtenir toutes les commandes
router.get('/', commandeController.findAll);

// Route pour obtenir les statistiques de ventes
router.get('/total', commandeController.getSalesStats);

// Route pour obtenir une commande par numéro de commande
router.get('/:num_commande', commandeController.findOne);

// Route pour mettre à jour une commande par numéro de commande
router.put('/:num_commande', commandeController.update);

// Route pour supprimer une commande par numéro de commande
router.delete('/:num_commande', commandeController.delete);

// Route pour ajouter un vin au panier
router.post('/panier/add', async (req, res) => {
    try {
        const { vinId, quantity } = req.body;
        const vin = await Vin.findById(vinId);
        if (!vin) {
            return res.status(404).json({ message: "Vin non trouvé." });
        }
        // Initialiser req.session.cart si ce n'est pas déjà fait
        req.session.cart = req.session.cart || [];
        req.session.cart.push({ vinId, quantity });
        res.status(200).json(req.session.cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de l'ajout du vin au panier." });
    }
});

// Route pour supprimer un vin du panier
router.delete('/panier/:vinId', (req, res) => {
    const { vinId } = req.params;
    req.session.cart = req.session.cart.filter(item => item.vinId !== vinId);
    res.status(200).json(req.session.cart);
});

// Route pour obtenir le contenu du panier
router.get('/panier', (req, res) => {
    try {
        const panier = req.session.cart || [];
        res.status(200).json(panier);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération du panier." });
    }
});

// Route pour valider le panier et créer une commande
router.post('/panier/valider', async (req, res) => {
    try {
        const { clientId, mode_paiement } = req.body;
        const cart = req.session.cart || [];

        if (!clientId) {
            return res.status(400).json({ message: "Client ID manquant." });
        }

        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: "Client non trouvé." });
        }

        let montant_total = 0;

        const vinUpdates = cart.map(async (item) => {
            const vin = await Vin.findById(item.vinId);
            if (!vin) {
                throw new Error(`Vin avec ID ${item.vinId} non trouvé.`);
            }
            if (vin.quantite < item.quantity) {
                throw new Error(`Quantité insuffisante pour le vin: ${vin.nom}`);
            }

            vin.quantite -= item.quantity;
            montant_total += vin.prix * item.quantity;

            return vin.save();
        });

        await Promise.all(vinUpdates);

        const num_commande = await generateNextCommandeId();

        const commande = new Commande({
            num_commande,
            date: new Date(),
            client: client._id,
            mode_paiement,
            vins: cart.map(item => ({ vin: item.vinId, quantite_vendue: item.quantity })),
            montant_total,
            statut: 'En attente'
        });

        const savedCommande = await commande.save();

        req.session.cart = [];

        res.status(201).json(savedCommande);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

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
