const mongoose = require('mongoose');

const vinSchema = new mongoose.Schema({
    num_vin: { type: String, required: true, unique: true }, 
    nom: { type: String, required: true },
    type: { type: String, required: true },
    cepages: { type: String, required: true },
    appellation: { type: String, required: true },
    teneur_alcool: { type: Number, required: true },
    description: { type: String, required: true },
    prix: { type: Number, required: true },
    photo: { type: String, required: false },
    quantite: { type: Number},
});

module.exports = mongoose.model('Vin', vinSchema);
