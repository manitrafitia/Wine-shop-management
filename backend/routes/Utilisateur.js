const express = require('express');
const router = express.Router();
const userController = require('../controllers/Utilisateur');

// Créer un utilisateur
router.post('/register', userController.createUser);

// Authentifier un utilisateur
router.post('/login', userController.authenticateUser);

module.exports = router;
