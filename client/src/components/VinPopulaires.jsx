import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function VinPopulaires() {
  const [vins, setVins] = useState([]);

  useEffect(() => {
    // Effectuez la requête Axios GET pour récupérer les données des trois premiers vins
    axios.get('http://localhost:3000/vin')
      .then(response => {
        // Mettez à jour l'état local avec les données des vins récupérées
        setVins(response.data.slice(0, 3)); // Supposons que la réponse soit un tableau de vins et vous souhaitez afficher les trois premiers
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des vins :', error);
      });
  }, []);

  return (
    <div className='bg-cover bg-center' style={{ backgroundImage: `url('/vecteezy_ai-generated-still-life-with-red-wine-grapes-and-fruits-on_35826032.jpg')` }}>
        <div className="z-10 bg-black opacity-75"></div> 
        <h2 className='text-center text-2xl p-2 pt-8 font-bold text-white'>Vins les plus populaires</h2>
        <div className="flex justify-center">
      {vins.map(vin => (
        <div key={vin._id} className="relative m-10 flex w-full max-w-xs flex-col overflow-hidden rounded border border-gray-100 bg-white">
          <a className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl bg-white justify-center" href="#">
            <img className="object-cover" src={vin.photo} alt="product image" />
          </a>
          <div className="mt-4 px-5 pb-5">
            <a href="#">
              <h5 className="text-xl tracking-tight text-slate-900">{vin.nom}</h5>
            </a>
            <div className="mt-2 mb-5 flex items-center justify-between">
              <p>
                <span className="text-3xl font-bold text-slate-900">{vin.prix} €</span>
              </p>
              <div className="flex items-center">
                <p>étoiles icones</p>
                <span className="mr-2 ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">5.0</span>
              </div>
            </div>
            <a href="#" className="flex items-center justify-center rounded-md bg-rose-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
              Ajouter à la carte
            </a>
          </div>
        </div>
      ))}
    </div>
    <div>
      <button className='py-2 px-4 bg-rose-900 text-white rounded-xl m-2'>
        Voir plus ...
      </button>
    </div>
    </div>
  )
}
