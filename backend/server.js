const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const dbConfig = require('./config/database.config.js');
const VinRoute = require('./routes/Vin.js');
const ClientRoute = require('./routes/Client.js');
const CommandeRoute = require('./routes/Commande.js');
const ProductionRoute = require('./routes/Production.js');
const EnregistrerRoute = require('./routes/Enregistrer.js');
const UserRoute = require('./routes/Utilisateur.js');
const VenteRoute = require('./routes/Vente.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Configuration de express-session
app.use(session({
    secret: 'secret', // Changez ceci par une chaîne aléatoire pour sécuriser vos sessions
    resave: false,
    saveUninitialized: true
}));

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Database Connected Successfully!!");    
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});

app.get('/', (req, res) => {
    res.json({"message": "Hello Crud Node Express"});
});

// Définition des routes
app.use('/vin', VinRoute);
app.use('/client', ClientRoute);
app.use('/commande', CommandeRoute);
app.use('/production', ProductionRoute);
app.use('/enregistrer', EnregistrerRoute);
app.use('/vente', VenteRoute);
app.use('/user', UserRoute);

// Démarrage du serveur
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
