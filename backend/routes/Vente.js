const express = require('express');
const router = express.Router();
const venteController = require('../controllers/Vente');

router.get('/month', venteController.getSalesByMonth);
router.post('/', venteController.create);
router.get('/', venteController.findAll);
router.get('/total', venteController.getSalesStats);
router.get('/:num_vente', venteController.findOne);
router.put('/:num_vente', venteController.update);
router.delete('/:num_vente', venteController.delete);

// Ajouter la nouvelle route pour récupérer les détails des vins par nom pour une vente spécifique
router.get('/:num_vente/vins', venteController.getVinsDetailsByName);

module.exports = router;
