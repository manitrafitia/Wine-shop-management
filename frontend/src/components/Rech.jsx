import React, { useState } from 'react';

export default function Rech() {
  const [showDetails, setShowDetails] = useState(false); // État pour gérer la visibilité du div de détails

  const toggleDetails = () => {
    setShowDetails(!showDetails); // Inverser l'état de visibilité du div de détails
  };

  return (
    <>
      <div className="rounded-xl bg-white p-7 m-8 mb-4 shadow-lg flex justify-center items-center">
        <form action="">
          <div className="flex flex-col md:flex-row gap-4">
            <div className='md:ml-2'>
              <label htmlFor="">Type</label>
              <select
                className='w-full p-2 mt-2 mb-3 border border-slate-200 rounded-lg'
              >
                <option value="">Sélectionnez un vin</option>
                <option value="1">Vin rouge</option>
                <option value="2">Vin blanc</option>
                <option value="3">Vin rosé</option>
              </select>
            </div>
            <div className='md:ml-2'>
              <label htmlFor="">Prix</label>
              <select
                className='w-full p-2 mt-2 mb-3 border border-slate-200 rounded-lg'
              >
                <option value="">Sélectionnez un prix</option>
                <option value="1">20 à 50 $</option>
                <option value="2">20 à 50 $</option>
                <option value="3">20 à 50 $</option>
              </select>
            </div>
            <div className='md:ml-2'>
              <label htmlFor="">Teneur en alcool (%)</label>
              <select
                className='w-full p-2 mt-2 mb-3 border border-slate-200 rounded-lg'
              >
                <option value="">Sélectionnez une valeur</option>
                <option value="1">20 à 50 $</option>
                <option value="2">20 à 50 $</option>
                <option value="3">20 à 50 $</option>
              </select>
            </div>
          </div>
          <div className="text-right mt-4">
            <button className="bg-slate-800 text-white px-4 py-2 rounded-lg">Rechercher</button>
          </div>
        </form>
      </div>
      <div className="m-4">
        <div className="rounded-xl bg-white p-4 m-4 shadow-lg flex">
          <div className="flex-none p-4 mr-4 rounded-xl bg-wine-800 w-52 h-52 flex justify-center items-center">
            <img src="wine_PNG99057.png" alt="" className="h-full" />
          </div>
          <div className='flex-grow p-4'>
            <div>
              <p className='text-xl font-semibold'>Nom du vin</p>
              <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              <div className={`overflow-hidden transition-height duration-500 ease-in-out ${showDetails ? 'h-auto' : 'h-0'}`}> {/* Utiliser une transition pour la hauteur */}
                <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
              <div className="text-right mt-4">
                <button className="bg-wine-800 text-white px-4 py-2 rounded-lg" onClick={toggleDetails}>{showDetails ? 'Masquer' : 'Voir plus ...'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
