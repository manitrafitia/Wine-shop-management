import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function AddProduction({ onClose, updateData }) {
  const [vins, setVins] = useState([]);
  const [productionData, setProductionData] = useState({
    vin: '',
    quantite: '',
    date_prod: '',
    region: '',
  });

  useEffect(() => {
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
        quantite: parseInt(productionData.quantite)
      };
    
      const response = await axios.post('http://localhost:3000/production', dataToSend);
      console.log(response.data);
      setProductionData({
        vin: '',
        quantite: '',
        date_prod: '',
        region: '',
      });

      updateData();

      onClose(); 
    } catch (error) {
      console.error('Error adding production:', error);
    }
  };

  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50'>
      <div ref={dialogRef} className='rounded-xl bg-white w-full max-w-md md:max-w-lg lg:max-w-xl z-10'>
        <div className="flex p-3 mb-4 bg-charade-100 pb-4 rounded-t-xl ">
          <h2 className='text-lg md:text-xl font-semibold mr-auto  mx-2 text-charade-600'>Ajouter une production</h2>
          <FontAwesomeIcon className='mt-2  mx-2 hover:text-charade-400' onClick={onClose} icon={faTimes} />
        </div>
        <form onSubmit={handleSubmit} className='text-black text-sm font-semibold mx-2  p-5'>
          <label htmlFor="" className='mb-4'>Vin </label>
          <select
            name='vin'
            value={productionData.vin}
            onChange={handleChange}
            className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
            required
          >
            <option value="">Sélectionnez un vin</option>
            {vins.map(vin => (
              <option key={vin.num_vin} value={vin.num_vin}>{vin.nom}</option>
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
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
