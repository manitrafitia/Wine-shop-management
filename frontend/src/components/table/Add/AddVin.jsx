import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Success from '../../Success';

export default function AddVin({ onClose, updateData }) {
  const [showSuccess, setShowSuccess] = useState(false); // État pour contrôler l'affichage du composant Success

  // Fonction pour afficher le composant Success
  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000); // Masquer le composant Success après 2 secondes
  };

  const [vinData, setVinData] = useState({
    nom: '',
    cepages: '',
    appellation: '',
    teneur_alcool: '',
    description: '',
    prix: '',
    photo: '',
    quantite: '',
    type: ''
  });
  const [selectedFileName, setSelectedFileName] = useState('');

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
    setVinData({ ...vinData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Supprimer le champ vide de la photo s'il existe
      const { photo, ...cleanedData } = vinData;

      const dataToSend = {
        ...cleanedData,
        photo: selectedFileName
      };
    
      const response = await axios.post('http://localhost:3000/vin', dataToSend);
      console.log(response.data);
      setVinData({
        nom: '',
        cepages: '',
        appellation: '',
        teneur_alcool: '',
        description: '',
        prix: '',
        photo: '',
        quantite: '',
        type: ''
      });

      // Mise à jour des données dans Vin.jsx après avoir ajouté un vin avec succès
      updateData();
      showSuccessMessage();
      onClose(); 
    } catch (error) {
      console.error('Erreur lors de l\'ajout du vin :', error);
    }
  };

  const loadFile = (event) => {
    const input = event.target;
    const file = input.files[0];
    const output = document.getElementById('preview_img');
    setSelectedFileName(file.name);

    output.src = URL.createObjectURL(file);

    output.onload = function () {
      URL.revokeObjectURL(output.src);
    };
  };

  return (
    <>
      {showSuccess && <Success />}
      <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50'>
        <div ref={dialogRef} className='rounded-xl bg-white w-full max-w-md md:max-w-lg lg:max-w-xl z-10'>
          <div className="flex p-3 mb-4 bg-charade-100 pb-4 rounded-t-xl ">
            <h2 className='text-lg md:text-xl font-semibold mr-auto  mx-2 text-charade-600'>Ajouter un vin</h2>
            <FontAwesomeIcon className='mt-2  mx-2 hover:text-charade-400' onClick={onClose} icon={faTimes} />
          </div>
          <form onSubmit={handleSubmit} className='text-black text-sm font-semibold mx-2  p-4'>
              <div>
              <div className="flex items-center space-x-6">
          <label className="block">
    <input
      type="file"
      onChange={handleChange}
      className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
      required
    />
  </label>
  {selectedFileName && (
    <p className="text-sm text-gray-500">{selectedFileName}</p>
  )}

        </div>
              </div>
              <label htmlFor="" className='mb-4'>Nom </label>
          <input
              type='text'
              name='nom'
              value={vinData.nom}
              onChange={handleChange}
              className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
             
            />
             <label htmlFor="" className='mb-4'>Type :</label>
             <select
  name='type'
  value={vinData.type}
  onChange={handleChange}
  className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
  required
>
  <option value="">Sélectionnez un vin</option>
  <option value="1">Vin rouge</option>
  <option value="2">Vin blanc</option>
  <option value="3">Vin rosé</option>
</select>

       <div className="flex">
          <div>
              <label htmlFor="" className='mb-4'>Cépage </label>
              <input
              type='text'
              name='cepages'
              value={vinData.cepages}
              onChange={handleChange}
              className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
              required
            />
          </div>
          <div  className='ml-2'>
              <label htmlFor="" className='mb-4'>Appellation </label>
              <input
              type='text'
              name='appellation'
              value={vinData.appellation}
              onChange={handleChange}
              className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
              required
            />
          </div>
          <div  className='ml-2'>
          <label htmlFor="" className='mb-4'>Teneur en alcool </label>
      
      <input
        type='number'
        name='teneur_alcool'
        value={vinData.teneur_alcool}
        onChange={handleChange}
        className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
        required
      />
          </div>
       </div>
        <div>
        <label htmlFor="" className='mb-4'>Description  </label>
            <textarea
              name='description'
              value={vinData.description}
              onChange={handleChange}
              className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
              required
            />
        </div>
       <div>
  <label htmlFor="" className='mb-4'>Prix :</label>
        <input
              type='number'
              name='prix'
              value={vinData.prix}
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
              >Ajouter</button>

            </div>
          </form>
        </div>
      </div>
    </>
  );
}
