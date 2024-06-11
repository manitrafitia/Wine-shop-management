import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ErrorModal = ({ error, onClose }) => {
  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50'>
      <div className='rounded-xl bg-white w-full max-w-md md:max-w-lg lg:max-w-xl z-10'>
        <div className="flex p-3 mb-4 bg-red-100 pb-4 rounded-t-xl ">
          <h2 className='text-lg md:text-xl font-semibold mr-auto  mx-2 text-red-600'>Erreur</h2>
          <FontAwesomeIcon className='mt-2  mx-2 hover:text-red-400' onClick={onClose} icon={faTimes} />
        </div>
        <div className='text-black text-sm font-semibold mx-2  p-5'>
          <p className='mb-4'>{error}</p>
          <button onClick={onClose} className='w-full bg-red-500 text-white py-2 rounded hover:bg-red-600'>Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
