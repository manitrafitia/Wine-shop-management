const express = require('express');
const router = express.Router();
const venteController = require('../controllers/Vente');

router.post('/', venteController.create);
router.get('/', venteController.findAll);
router.get('/total', venteController.getSalesStats);
router.get('/:num_vente', venteController.findOne);
router.put('/:num_vente', venteController.update);
router.delete('/:num_vente', venteController.delete);


module.exports = router;
