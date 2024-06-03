const mongoose = require('mongoose');

const CommandeSchema = new mongoose.Schema({
  num_commande: { type: String, required: true, unique: true},
  date: { type: Date, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  vins: [
    {
        vin: { type: mongoose.Schema.Types.ObjectId, ref: 'Vin' },
        quantite_vendue: Number
    }
],
  paiement: { type: Number, required: true },
  statut: { type: Number, required: true },
  quantite_vendue: { type: Number, required: true },
  montant_total: { type: Number, required: true },
});

module.exports = mongoose.model('Commande', CommandeSchema);