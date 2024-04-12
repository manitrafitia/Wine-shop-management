import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faPencil, faCircleExclamation, faPlus, faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';


export default function ConfirmDelete({ onClose, onDelete }) {

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
  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50'>
        <div  ref={dialogRef} className='rounded-xl bg-white w-600 max-w-md md:max-w-lg lg:max-w-xl z-10 p-10  '>
            <div className='flex justify-center items-center mb-4'>
              <img src="system-regular-29-cross.gif" className='text-red-500 w-10' alt="" />
          
            </div>
            <div>
              <div className='flex justify-center items-center mb-2'>
              <p className="font-semibold text-2xl">Suppression</p>
              </div>
              <div className='flex justify-center items-center mb-7'>
              <p className='font-semi-bold'>
                Etes-vous sûr de vouloir supprimer cet élément?
            </p>
              </div>

           
        </div>
        <div>
            <div className="flex justify-between">
            <button
              type='button'
              onClick={onClose}
              className='w-1/2 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400'
            >
              Fermer
            </button>
            <button
  type='submit'
  onClick={onDelete}
  className='w-1/2 bg-red-500 text-white ml-2 py-2 rounded hover:bg-red-600'
>Supprimer</button>

            </div>
        </div>
        </div>
    </div>
  )
}
