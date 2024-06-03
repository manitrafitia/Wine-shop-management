import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function AddVente({ onClose, updateData }) {
  const [vins, setVins] = useState([]);
  const [venteData, setVenteData] = useState({
    date: '',
    mode_paiement: '',
    client: { num_client: '' }, // Modification ici
    vins: []
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
    setVenteData({ ...venteData, [name]: value });
  };

  const handleClientChange = (e) => {
    const num_client = e.target.value;
    setVenteData({ ...venteData, client: { num_client } });
  };

  const handleVinChange = (e, index) => {
    const newVins = [...venteData.vins];
    newVins[index] = { num_vin: e.target.value, quantite: 1 }; // Hardcoding quantite as 1 for simplicity
    setVenteData({ ...venteData, vins: newVins });
  };

  const handleAddVin = () => {
    setVenteData({
      ...venteData,
      vins: [...venteData.vins, { num_vin: '', quantite: 1 }] // Hardcoding quantite as 1 for simplicity
    });
  };

  const handleRemoveVin = (index) => {
    const newVins = [...venteData.vins];
    newVins.splice(index, 1);
    setVenteData({ ...venteData, vins: newVins });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/vente', venteData);
      console.log(response.data);
      setVenteData({
        date: '',
        mode_paiement: '',
        client: { num_client: '' }, // Réinitialiser le client à une chaîne vide après l'envoi
        vins: []
      });
      updateData();
      onClose(); 
    } catch (error) {
      console.error('Error adding vente:', error);
    }
  };

  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50'>
      <div ref={dialogRef} className='rounded-xl bg-white w-full max-w-md md:max-w-lg lg:max-w-xl z-10'>
        <div className="flex p-3 mb-4 bg-charade-100 pb-4 rounded-t-xl ">
          <h2 className='text-lg md:text-xl font-semibold mr-auto  mx-2 text-charade-600'>Ajouter une vente</h2>
          <FontAwesomeIcon className='mt-2  mx-2 hover:text-charade-400' onClick={onClose} icon={faTimes} />
        </div>
        <form onSubmit={handleSubmit} className='text-black text-sm font-semibold mx-2  p-5'>
          <label htmlFor="" className='mb-4'>Date de vente</label>
          <input
            type='date'
            name='date'
            value={venteData.date}
            onChange={handleChange}
            className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
            required
          />
          <label htmlFor="" className='mb-4'>Mode de paiement</label>
          <input
            name='mode_paiement'
            value={venteData.mode_paiement}
            onChange={handleChange}
            className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
            required
          />
          <label htmlFor="" className='mb-4'>Numéro de client</label>
          <input
            name='num_client'
            value={venteData.client.num_client}
            onChange={handleClientChange}
            className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
            required
          />
          <label htmlFor="" className='mb-4'>Vins</label>
          {venteData.vins.map((vin, index) => (
            <div key={index} className="flex mb-3">
              <select
                value={vin.num_vin}
                onChange={(e) => handleVinChange(e, index)}
                className='w-full p-2 border border-charade-200 rounded-lg mr-2'
                required
              >
                <option value="">Sélectionnez un vin</option>
                {vins.map((vinOption, index) => (
                  <option key={index} value={vinOption.num_vin}>{vinOption.nom}</option>
                ))}
              </select>
              <input
                type="number"
                value={vin.quantite}
                className='w-16 p-2 border border-charade-200 rounded-lg'
                readOnly
              />
              <button type="button" onClick={() => handleRemoveVin(index)}>Supprimer</button>
            </div>
          ))}
          <button type="button" onClick={handleAddVin}>Ajouter un vin</button>
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
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
