const express = require('express');
const router = express.Router();
const venteController = require('../controllers/EnregistrerVente');

router.post('/', venteController.createClientVenteVendre);

module.exports = router;
