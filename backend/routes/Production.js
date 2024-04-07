const express = require('express');
const router = express.Router();
const productionController = require('../controllers/Production');

router.post('/', productionController.create);
router.get('/', productionController.findAll);
router.get('/total', productionController.getTotalWineProduced);
router.get('/:num_prod', productionController.findOne);
router.put('/:num_prod', productionController.update);
router.delete('/:num_prod', productionController.delete);


module.exports = router;
