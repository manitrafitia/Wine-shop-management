const mongoose = require('mongoose');

const VenteSchema = new mongoose.Schema({
  num_vente: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  mode_paiement: { type: String},
  vins: [{ 
    vin: { type: mongoose.Schema.Types.ObjectId, ref: 'Vin', required: true },
    quantite: { type: Number, required: true }
  }],
  montant_total: { type: Number, required: true },
});

module.exports = mongoose.model('Vente', VenteSchema);
