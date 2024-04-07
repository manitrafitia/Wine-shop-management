const express = require('express');
const router = express.Router();
const clientController = require('../controllers/Client');

router.post('/', clientController.create);
router.get('/', clientController.findAll);
router.get('/:num_client', clientController.findOne);
router.put('/:num_client', clientController.update);
router.delete('/:num_client', clientController.delete);

module.exports = router;
