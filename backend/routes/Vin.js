const express = require('express');
const VinController = require('../controllers/Vin');
const router = express.Router();

router.post('/search', VinController.search);
router.get('/type', VinController.countByType);
router.post('/', VinController.create);
router.get('/', VinController.findAll);
router.get('/:num_vin', VinController.findOne);
router.put('/:num_vin', VinController.update);
router.delete('/:num_vin', VinController.delete);

module.exports = router;
