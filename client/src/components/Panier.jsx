import React from 'react';

export default function ({ panier, removeFromCart, updateQuantity }){
  return (
    <div>
      <h2>Panier</h2>
      {panier.map(item => (
        <div key={item._id}>
          <h3>{item.nom}</h3>
          <p>Quantité: <input type="number" value={item.quantity} onChange={(e) => updateQuantity(item._id, e.target.value)} /></p>
          <button onClick={() => removeFromCart(item._id)}>Supprimer du panier</button>
        </div>
      ))}
    </div>
  );
};
