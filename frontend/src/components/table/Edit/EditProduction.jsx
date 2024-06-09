import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function EditProduction({ onClose, updateData, productionId, productionData: initialProductionData }) {
  const [vins, setVins] = useState([]);
  const [productionData, setProductionData] = useState(initialProductionData || {});

  useEffect(() => {
    setProductionData(initialProductionData || {});
  }, [initialProductionData]);

  useEffect(() => {
    // Récupérer les données des vins depuis l'API
    axios.get('http://localhost:3000/vin')
      .then(response => {
        setVins(response.data);
      })
      .catch(error => {
        console.error('Error fetching vins:', error);
      });
  }, []);

  const dialogRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (productionId) {
        // Si c'est une modification, envoyer une requête PUT avec les données modifiées
        await axios.put(`http://localhost:3000/production/${productionId}`, productionData);
      } else {
        // Si c'est une création, envoyer une requête POST avec les nouvelles données
        await axios.post('http://localhost:3000/production', productionData);
      }
  
      console.log('Production edited/added successfully');
  
      // Réinitialiser le formulaire après la soumission réussie
      setProductionData({
        vin: '',
        quantite: '',
        date_prod: '',
        region: '',
        statut: '',
      });
  
      // Mettre à jour les données dans Production.jsx après avoir ajouté ou modifié une production avec succès
      updateData();
  
      onClose();
    } catch (error) {
      console.error('Error editing/adding production:', error);
    }
  };

  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50'>
      <div ref={dialogRef} className='rounded-xl bg-white w-full max-w-md md:max-w-lg lg:max-w-xl z-10'>
        <div className="flex p-3 mb-4 bg-charade-100 pb-4 rounded-t-xl ">
          <h2 className='text-lg md:text-xl font-semibold mr-auto  mx-2 text-charade-600'>Modifier une production</h2>
          <FontAwesomeIcon className='mt-2  mx-2 hover:text-charade-400' onClick={onClose} icon={faTimes} />
        </div>
        <form onSubmit={handleSubmit} className='text-black text-sm font-semibold mx-2  p-5'>
          <label htmlFor="" className='mb-4'>Vin </label>
          <select
            name='vin'
            value={productionData.vin}
            onChange={handleChange}
            className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg text-charade-400'
            required
          >
            {vins.map((vin) => (
              <option key={vin._id} value={vin._id}>{vin.nom}</option>
            ))}
          </select>
          
          <div className="flex">
            <div>
              <label htmlFor="" className='mb-4'>Quantité </label>
              <input
                type='number'
                name='quantite'
                value={productionData.quantite}
                onChange={handleChange}
                className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
                required
              />
            </div>
            <div className='ml-2'>
              <label htmlFor="" className='mb-4'>Date de production </label>
              <input
                type='date'
                name='date_prod'
                value={productionData.date_prod}
                onChange={handleChange}
                className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="" className='mb-4'>Région de production </label>
            <input
              name='region'
              value={productionData.region}
              onChange={handleChange}
              className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
              required
            />
          </div>
          <div>
            <label htmlFor="" className='mb-4'>Statut </label>
            <select
              name='statut'
              value={productionData.statut}
              onChange={handleChange}
              className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
              required
            >
              <option value="1">En attente</option>
              <option value="2">En production</option>
              <option value="3">Produit</option>
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
              className='w-1/2 bg-charade-500 text-white ml-2 py-2 rounded hover:bg-charade-600'
            >
              Modifier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
