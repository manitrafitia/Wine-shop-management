import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function AddVin({ onClose }) {

  const [vinData, setVinData] = useState({
    nom: '',
    cepages: '',
    appellation: '',
    teneur_alcool: '',
    description: '',
    prix: '',
    photo: '',
    quantite: ''
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
      const dataToSend = {
        ...vinData,
        photo: selectedFileName // Assurez-vous que le nom du fichier sélectionné est correctement ajouté à l'objet vinData
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
        quantite: ''
      });
      onClose(); 
    } catch (error) {
      console.error('Error adding vin:', error);
    }
  };
  

  const loadFile = (event) => {
    const input = event.target;
    const file = input.files[0];
    const output = document.getElementById('preview_img');
    setSelectedFileName(file.name);

    output.src = URL.createObjectURL(file);

    output.onload = function () {
      URL.revokeObjectURL(output.src); // libère la mémoire
    };
  };

  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50'>
      <div ref={dialogRef} className='rounded-xl bg-white w-full max-w-md md:max-w-lg lg:max-w-xl z-10'>
        <div className="flex p-3 mb-4 bg-slate-100 pb-4 rounded-t-xl ">
          <h2 className='text-lg md:text-xl font-semibold mr-auto  mx-2 text-slate-600'>Ajouter un vin</h2>
          <FontAwesomeIcon className='mt-2  mx-2 hover:text-slate-400' onClick={onClose} icon={faTimes} />
        </div>
        <form onSubmit={handleSubmit} className='text-slate-400 font-semibold mx-2  p-5'>
            <div>
            <div className="flex items-center space-x-6">
        <div className="shrink-0">
          <img
            id='preview_img'
            className="h-16 w-16 object-cover rounded-full"
            src="https://media.istockphoto.com/id/527820617/vector/photographs-pictures-icon-on-white-background.jpg?s=612x612&w=0&k=20&c=KeE_j06DJgO7Dkx4l6gqPN6iEKQyWxOuzXjnMY5ul_A="
            alt="Current profile photo"
          />
        </div>
        <label className="block">
  <input
    type="file"
    onChange={(event) => {
      loadFile(event);
      handleChange(event);
    }}
    className="hidden"
    required
  />
  <div className=' bg-indigo-100 hover:bg-indigo-200 text-indigo-500 rounded-full'>
 <p className="p-2">
 Choisir un fichier
  </p>
  </div>
</label>
{selectedFileName && (
  <p className="text-sm text-gray-500">{selectedFileName}</p>
)}

      </div>
            </div>
            <label htmlFor="">Nom </label>
        <input
            type='text'
            name='nom'
            value={vinData.nom}
            onChange={handleChange}
            className='w-full p-2 mb-3 border border-slate-200 rounded'
           
          />
            
     <div className="flex">
        <div>
            <label htmlFor="">Cépage </label>
            <input
            type='text'
            name='cepages'
            value={vinData.cepages}
            onChange={handleChange}
            className='w-full p-2 mb-3 border border-slate-200 rounded'
            required
          />
        </div>
        <div  className='ml-2'>
            <label htmlFor="">Appellation </label>
            <input
            type='text'
            name='appellation'
            value={vinData.appellation}
            onChange={handleChange}
            className='w-full p-2 mb-3 border border-slate-200 rounded'
            required
          />
        </div>
        <div  className='ml-2'>
        <label htmlFor="">Teneur en alcool </label>
    
    <input
      type='number'
      name='teneur_alcool'
      value={vinData.teneur_alcool}
      onChange={handleChange}
      className='w-full p-2 mb-3 border border-slate-200 rounded'
      required
    />
        </div>
     </div>
      <div>
      <label htmlFor="">Déscription  </label>
          <textarea
            name='description'
            value={vinData.description}
            onChange={handleChange}
            className='w-full p-2 mb-3 border border-slate-200 rounded'
            required
          />
      </div>
     <div>
<label htmlFor="">Prix :</label>
      <input
            type='number'
            name='prix'
            value={vinData.prix}
            onChange={handleChange}
            className='w-full p-2 mb-3 border border-slate-200 rounded'
            required
          />

      </div>
          <div className='flex justify-between'>
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
>Ajouter</button>

          </div>
        </form>
      </div>
    </div>
  );
}
