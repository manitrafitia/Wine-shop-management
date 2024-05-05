const express = require('express');
const router = express.Router();
const CommandeController = require('../controllers/EnregistrerVente');

router.post('/', CommandeController.createClientCommandeVendre);

module.exports = router;
