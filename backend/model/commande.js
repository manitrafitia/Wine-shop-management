const mongoose = require('mongoose');

const CommandeSchema = new mongoose.Schema({
  num_commande: { type: String, required: true, unique: true},
  date: { type: Date, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  mode_paiement: { type: String, required: true },
  vin: { type: mongoose.Schema.Types.ObjectId, ref: 'Vin', required: true },
  paiement: { type: Number, required: true },
  date_paiement: {  type: Date },
  statut: { type: Number, required: true },
  quantite_vendue: { type: Number, required: true },
  montant_total: { type: Number, required: true },
});

module.exports = mongoose.model('Commande', CommandeSchema);