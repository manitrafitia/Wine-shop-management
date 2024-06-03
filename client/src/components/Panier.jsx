import React from 'react';
import axios from 'axios';

export default function Panier({ panier, updateQuantity, removeFromCart }) {
  const handleRemoveFromCart = async (vinId) => {
    try {
        await axios.delete(`http://localhost:3000/commande/panier/${vinId}`);
        removeFromCart(vinId);
    } catch (error) {
        console.error(error);
    }
  };

  const handleValiderPanier = async () => {
    try {
        const clientId = 'ID_DU_CLIENT'; // Remplacez ceci par l'ID du client approprié
        const mode_paiement = 'CB'; // Remplacez ceci par le mode de paiement approprié

        const response = await axios.post('http://localhost:3000/commande/panier/valider', { clientId, mode_paiement });
        alert('Commande passée avec succès!');
    } catch (error) {
        console.error(error);
        alert("Une erreur s'est produite lors de la validation du panier.");
    }
  };

  return (
    <div>
      <h2>Panier</h2>
      {panier.map(item => (
        <div key={item._id}>
          <h3>Nom: {item.nom}</h3>
          <p>Quantité: <input type="number" value={item.quantity} onChange={(e) => updateQuantity(item._id, e.target.value)} /></p>
          <button onClick={() => handleRemoveFromCart(item._id)}>Supprimer du panier</button>
        </div>
      ))}
      <button onClick={handleValiderPanier}>Valider le panier</button>
    </div>
  );
}
