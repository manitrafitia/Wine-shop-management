const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  num_client: { type: String, required: true }, 
  nom: { type: String, required: true },
  adresse: { type: String, required: true },
  email: { type: String, required: true },
  telephone: { type: String, required: true },
});

module.exports = mongoose.model('Client', ClientSchema);
