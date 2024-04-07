const mongoose = require('mongoose');

const ProductionSchema = new mongoose.Schema({
  num_prod: { type: String, require: true, unique: true },
  vin: { type: mongoose.Schema.Types.ObjectId, ref: 'Vin', required: true },
  quantite: { type: Number, required: true },
  date_prod: { type: Date, required: true },
  region: { type: String, required: true },
});

module.exports = mongoose.model('Production', ProductionSchema);
