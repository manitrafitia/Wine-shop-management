import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function EditCommande({ commande, onClose, updateData }) {
  const [formData, setFormData] = useState({
    paiement: commande.paiement,
    statut: commande.statut
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/commande/${commande.num_commande}`, formData);
      updateData(); // Mettre à jour les données après modification
      onClose(); // Fermer le formulaire d'édition
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande :', error);
    }
  };

  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50'>
      <div className='rounded-xl bg-white w-full max-w-md md:max-w-lg lg:max-w-xl z-10'>
        <div className="flex p-3 mb-4 bg-charade-100 pb-4 rounded-t-xl ">
          <h2 className='text-lg md:text-xl font-semibold mr-auto  mx-2 text-charade-600'>Modifier une commande</h2>
          <FontAwesomeIcon className='mt-2  mx-2 hover:text-charade-400' onClick={onClose} icon={faTimes} />
        </div>
        <form onSubmit={handleSubmit} className='text-black text-sm font-semibold mx-2  p-5'>
          <div>
            <label htmlFor="paiement" className='mb-4'>Paiement</label>
            <select
              name='paiement'
              value={formData.paiement}
              onChange={handleChange}
              className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
              required
            >
               <option value="1">Non payé</option>
              <option value="2">Payé</option>
            </select>
          </div>
          <div>
            <label htmlFor="statut" className='mb-4'>Statut</label>
            <select
              name='statut'
              value={formData.statut}
              onChange={handleChange}
              className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
              required
            >
              <option value="1">En cours</option>
              <option value="2">Reçu</option>
            </select>
          </div>
          <div className='flex justify-between mb-4'>
            <button
              type='button'
              onClick={onClose}
              className='w-1/2 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400'
            >
              Fermer
            </button>
            <button
              type='submit'
              className='w-1/2 bg-blue-500 text-white ml-2 py-2 rounded hover:bg-blue-600'
            >
              Modifier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
