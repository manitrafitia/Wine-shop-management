const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/Commande');
const Vin = require('../model/vin'); // Importer le modèle Vin depuis le bon emplacement

router.get('/month', commandeController.getSalesByMonth);
router.post('/', commandeController.create);
router.get('/', commandeController.findAll);
router.get('/total', commandeController.getSalesStats);
router.get('/:num_commande', commandeController.findOne);
router.put('/:num_commande', commandeController.update);
router.delete('/:num_commande', commandeController.delete);

// POST panier
router.post('/panier/add', async (req, res) => {
    try {
      const { vinId, quantity } = req.body;
      const vin = await Vin.findById(vinId); // Utiliser le modèle Vin correctement
      if (!vin) {
        return res.status(404).json({ message: "Vin non trouvé." });
      }
      req.session.cart.push({ vinId, quantity });
      res.status(200).json(req.session.cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur s'est produite lors de l'ajout du vin au panier." });
    }
  });
  
  router.post('/commande', async (req, res) => {
    try {
      const { client, mode_paiement } = req.body;
      const cart = req.session.cart;
      // Processus de création de commande
      // Assurez-vous de valider et enregistrer la commande dans MongoDB
      res.status(201).json({ message: "Commande passée avec succès!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Une erreur s'est produite lors du passage de la commande." });
    }
  });

module.exports = router;
