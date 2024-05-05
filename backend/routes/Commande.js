const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/Commande');

router.get('/month', commandeController.getSalesByMonth);
router.post('/', commandeController.create);
router.get('/', commandeController.findAll);
router.get('/total', commandeController.getSalesStats);
router.get('/:num_commande', commandeController.findOne);
router.put('/:num_commande', commandeController.update);
router.delete('/:num_commande', commandeController.delete);



module.exports = router;