import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function AddProduction({ onClose, updateData }) {
  const [vins, setVins] = useState([]); // Définition de l'état pour stocker les données des vins
  const [productionData, setProductionData] = useState({
    vin: '',
    quantite: '',
    date_prod: '',
    region: '',
  });

  useEffect(() => {
    // Effectue une requête GET pour récupérer les données des vins
    axios.get('http://localhost:3000/vin')
      .then(response => {
        // Met à jour l'état local avec les données des vins
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
    setProductionData({ ...productionData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        vin: {
          num_vin: productionData.vin
        },
        date_prod: productionData.date_prod,
        region: productionData.region,
        quantite: parseInt(productionData.quantite) // Assurez-vous de convertir la quantité en nombre si elle est de type string
      };
    
      const response = await axios.post('http://localhost:3000/production', dataToSend);
      console.log(response.data);
      setProductionData({
        vin: '',
        quantite: '',
        date_prod: '',
        region: '',
      });

      // Mettre à jour les données dans Production.jsx après avoir ajouté une production avec succès
      updateData();

      onClose(); 
    } catch (error) {
      console.error('Error adding production:', error);
    }
  };

  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50'>
      <div ref={dialogRef} className='rounded-xl bg-white w-full max-w-md md:max-w-lg lg:max-w-xl z-10'>
        <div className="flex p-3 mb-2 bg-slate-100 pb-4 rounded-t-xl ">
          <h2 className='text-lg md:text-xl font-semibold mr-auto  mx-2 text-slate-600'>Ajouter une production</h2>
          <FontAwesomeIcon className='mt-2  mx-2 hover:text-slate-400' onClick={onClose} icon={faTimes} />
        </div>
        <form onSubmit={handleSubmit} className='text-slate-400 font-semibold mx-2  p-5'>
          <label htmlFor="" className='mb-2'>Vin </label>
          <select
            name='vin'
            value={productionData.vin}
            onChange={handleChange}
            className='w-full p-2 mb-3 border border-slate-200 rounded'
            required
          >
            <option value="">Sélectionnez un vin</option>
            {vins.map(vin => (
              <option key={vin.num_vin} value={vin.num_vin}>{vin.nom}</option>
            ))}
          </select>
          <div className="flex">
            <div>
              <label htmlFor="" className='mb-2'>Quantité </label>
              <input
                type='number'
                name='quantite'
                value={productionData.quantite}
                onChange={handleChange}
                className='w-full p-2 mb-3 border border-slate-200 rounded'
                required
              />
            </div>
            <div className='ml-2'>
              <label htmlFor="" className='mb-2'>Date de production </label>
              <input
                type='date'
                name='date_prod'
                value={productionData.date_prod}
                onChange={handleChange}
                className='w-full p-2 mb-3 border border-slate-200 rounded'
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="" className='mb-2'>Région de production </label>
            <input
              name='region'
              value={productionData.region}
              onChange={handleChange}
              className='w-full p-2 mb-3 border border-slate-200 rounded'
              required
            />
          </div>
          <div className='flex justify-between mb-2'>
            <button
              type='button'
              onClick={onClose}
              className='w-1/2 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400'
            >
              Fermer
            </button>
            <button
              type='submit'
              className='w-1/2 bg-ziggurat-500 text-white ml-2 py-2 rounded hover:bg-ziggurat-600'
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
