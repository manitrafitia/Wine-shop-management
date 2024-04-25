import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function AddClient({ onClose, updateData }) {
  const [clientData, setClientData] = useState({
    nom: '',
    adresse: '',
    email: '',
    telephone: '',
    photo_profil: '',
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
    setClientData({ ...clientData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...clientData,
        'photo_profil': selectedFileName,
      };

      const response = await axios.post('http://localhost:3000/client', dataToSend);
      console.log(response.data);
      setClientData({
        nom: '',
        adresse: '',
        email: '',
        telephone: '',
        photo_profil: '',
      });

      updateData();

      onClose(); 
    } catch (error) {
      console.error('Error adding client:', error);
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
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50'>
      <div ref={dialogRef} className='rounded-xl bg-white w-full max-w-md md:max-w-lg lg:max-w-xl z-10'>
        <div className="flex p-3 mb-4 bg-charade-100 pb-4 rounded-t-xl ">
          <h2 className='text-lg md:text-xl font-semibold mr-auto  mx-2 text-charade-600'>Ajouter un client</h2>
          <FontAwesomeIcon className='mt-2  mx-2 hover:text-charade-400' onClick={onClose} icon={faTimes} />
        </div>
        <form onSubmit={handleSubmit} className='text-black text-sm font-semibold mx-2  p-5'>
          <div>
            <div className="flex items-center space-x-6">
            </div>
          </div>
          <label htmlFor="" className='mb-4'>Nom </label>
          <input
            type='text'
            name='nom'
            value={clientData.nom}
            onChange={handleChange}
            className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
            required
          />
          <label htmlFor="" className='mb-4'>Adresse </label>
          <input
            type='text'
            name='adresse'
            value={clientData.adresse}
            onChange={handleChange}
            className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
            required
          />
          <label htmlFor="" className='mb-4'>Email </label>
          <input
            type='email'
            name='email'
            value={clientData.email}
            onChange={handleChange}
            className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
            required
          />
          <label htmlFor="" className='mb-4'>Téléphone </label>
          <input
            type='tel'
            name='telephone'
            value={clientData.telephone}
            onChange={handleChange}
            className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
            required
          />
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
  );
}
