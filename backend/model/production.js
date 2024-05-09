const mongoose = require('mongoose');

const ProductionSchema = new mongoose.Schema({
  num_prod: { type: String, require: true, unique: true },
  vin: { type: mongoose.Schema.Types.ObjectId, ref: 'Vin', required: true },
  quantite: { type: Number },
  date_prod: { type: Date, required: true },
  region: { type: String, required: true },
  statut: { type: Number, required: true, default: 1 } // 1: En attente, 2: En production, 3: Produit
});

ProductionSchema.pre('save', async function(next) {
  if (this.statut === 3 && !this.quantite) {
    return next(new Error("La quantité doit être spécifiée pour le statut 'produit'"));
  }
  next();
});

module.exports = mongoose.model('Production', ProductionSchema);
