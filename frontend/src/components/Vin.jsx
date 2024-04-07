import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { faEllipsisH, faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Vin() {
  const [vins, setVins] = useState([]);
  const [showDialogIndex, setShowDialogIndex] = useState(-1);
  const [dialogPosition, setDialogPosition] = useState({ top: 0, left: 0 });

  const iconRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const fetchVins = async () => {
      try {
        const response = await axios.get('http://localhost:3000/vin');
        setVins(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des vins :', error);
      }
    };

    fetchVins();
  }, []);

  const handleEllipsisClick = (index, event) => {
    const iconRect = event.target.getBoundingClientRect();
    setShowDialogIndex(index);
    setDialogPosition({ top: iconRect.bottom, left: iconRect.left - 50 }); // Ajustement de 50px vers la gauche
  };

  const handleCloseDialog = () => {
    setShowDialogIndex(-1);
  };

  // Gestion de la fermeture de la boîte de dialogue en cliquant à l'extérieur de celle-ci
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setShowDialogIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fonction pour déterminer la couleur en fonction de la quantité
  const getQuantiteColor = (quantite) => {
    if (quantite > 100) {
      return 'text-green-500';
    } else if (quantite > 50) {
      return 'text-yellow-500';
    } else {
      return 'text-red-500';
    }
  };

  return (
    <div className="overflow-x-auto m-4 bg-white rounded-lg p-4">
      <div className="flex justify-between mb-4">
        <p className="text-2xl text-gray-700">Liste des vins</p>
        <div>
          <button className="bg-blue-500 text-white px-4 py-2 mr-2 rounded hover:bg-blue-600">Ajouter</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Action</button>
        </div>
      </div>
      <table className="table-auto min-w-full z-3">
        <thead className='text-pink-600'>
          <tr>
            <th className="px-4 py-4">#</th>
            <th className="px-4 py-4">Nom</th>
            <th className="px-4 py-4">Prix(€)</th>
            <th className="px-4 py-4">Quantité</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {vins.map((vin, index) => (
            <React.Fragment key={index}>
              <tr>
                <td className="border-t border-gray-200 px-4 py-4">{vin.num_vin}</td>
                <td className="border-t border-gray-200 px-4 py-4">{vin.nom}</td>
                <td className="border-t border-gray-200 px-4 py-4">{vin.prix}</td>
                <td className={`border-t border-gray-200 px-4 py-4 font-bold ${getQuantiteColor(vin.quantite)}`}>{vin.quantite}</td>
                <td className="border-t border-gray-200 px-4 py-4 hover:bg-gray-100 hover:cursor-pointer"
                 onClick={(event) => handleEllipsisClick(index, event)}
                 ref={iconRef}>
                  <FontAwesomeIcon icon={faEllipsisH}/>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {showDialogIndex !== -1 && (
        <div ref={dialogRef} className="bg-white p-4 rounded-lg border absolute font-semibold" style={{ top: dialogPosition.top, left: dialogPosition.left }}>
          <ul>
            <li className='text-gray-500 mb-1 '><span className='mr-3'><FontAwesomeIcon icon={faEye}/></span>Voir</li>
            <li className='text-green-500 mb-1 '><span className='mr-3'><FontAwesomeIcon icon={faPencil}/></span>Modifier</li>
            <li className='text-red-500 mb-1 '><span className='mr-3'><FontAwesomeIcon icon={faTrash}/></span>Supprimer</li>
          </ul>
        </div>
      )}
    </div>
  );
}
