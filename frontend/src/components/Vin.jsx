import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faPencil, faTrash, faPlus, faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import useTableFunctions from './TableFunctions';

export default function Vin() {
  const {
    data,
    setData,
    setShowDialogIndex,
    setDialogPosition,
    paginate,
    totalPages,
  } = useTableFunctions();

  const [sortType, setSortType] = useState('asc');
  const [sortColumn, setSortColumn] = useState('');
  const [itemsPerPage] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCheckedAll, setIsCheckedAll] = useState(false); // État pour suivre si toutes les cases sont cochées
  const [checkedItems, setCheckedItems] = useState([]); // État pour suivre les cases cochées

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/vin');
        setData(response.data);
        setCheckedItems(new Array(response.data.length).fill(false)); // Initialiser toutes les cases à cocher à false
        setIsCheckedAll(false); // Reset isCheckedAll when data is loaded
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, [setData]);

  const handleCheckItem = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
  };

  const handleCheckAll = () => {
    const newCheckedItems = isCheckedAll ? new Array(data.length).fill(false) : new Array(data.length).fill(true);
    setCheckedItems(newCheckedItems);
    setIsCheckedAll(!isCheckedAll);
  };

  useEffect(() => {
    setIsCheckedAll(checkedItems.every(item => item));
  }, [checkedItems]);

  const handleEllipsisClick = (index, event) => {
    const iconRect = event.target.getBoundingClientRect();
    setShowDialogIndex(index);
    setDialogPosition({ top: iconRect.bottom, left: iconRect.left - 75 });
  };

  const handleCloseDialog = () => {
    setShowDialogIndex(-1);
  };

  const getQuantiteColor = (quantite) => {
    return quantite < 10 ? 'text-red-500' : 'text-slate-500';
  };

  const handleSort = (columnName) => {
    if (columnName === sortColumn) {
      setSortType(sortType === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnName);
      setSortType('asc');
    }
  };

  // Trier les données en fonction de la colonne et du type de tri
  const sortedData = data.slice().sort((a, b) => {
    const columnA = a[sortColumn];
    const columnB = b[sortColumn];
    let comparison = 0;

    if (columnA > columnB) {
      comparison = 1;
    } else if (columnA < columnB) {
      comparison = -1;
    }

    return sortType === 'desc' ? comparison * -1 : comparison;
  });

  // Calculer l'index de début et de fin des éléments à afficher pour la page actuelle
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  return (
    <div className="overflow-x-auto m-4 bg-white rounded-lg p-4">
      <div className="flex justify-between mb-4">
        <p className="text-2xl text-slate-700">Liste des vins</p>
        <div>
          <button className="bg-pink-500 text-white px-4 mr-2 py-2 rounded hover:bg-pink-600"> <FontAwesomeIcon className='mr-2' icon={faPlus} />Ajouter un vin</button>
          <button className="bg-slate-100 px-4 py-2 rounded hover:bg-slate-200"> <FontAwesomeIcon className='mr-2' icon={faTrash} />Supprimer tout</button>
        </div>
      </div>
      <table className="table-auto min-w-full z-3">
        <thead className='text-pink-500 text-left'>
          <tr>
            <th className="px-4 py-4">
              <input id="header-checkbox" type="checkbox" checked={isCheckedAll} onChange={handleCheckAll} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            </th>
            <th className="px-4 py-4" onClick={() => handleSort('num_vin')}>
              #<FontAwesomeIcon className="float-right text-pink-200 hover:text-pink-600" icon={sortColumn === 'num_vin' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4" onClick={() => handleSort('nom')}>
              Nom<FontAwesomeIcon className="float-right text-pink-200 hover:text-pink-600" icon={sortColumn === 'nom' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4" onClick={() => handleSort('prix')}>
              Prix(€)<FontAwesomeIcon className="float-right text-pink-200 hover:text-pink-600" icon={sortColumn === 'prix' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4" onClick={() => handleSort('quantite')}>
              Quantité<FontAwesomeIcon className="float-right text-pink-200 hover:text-pink-600" icon={sortColumn === 'quantite' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4"></th>
          </tr>
        </thead>
        <tbody>
          {/* Afficher les données paginées */}
          {paginatedData.map((vin, index) => (
            <tr key={index}>
              <td className="border-t border-slate-200 px-4 py-4">
                <input id={`checkbox-${index}`} type="checkbox" checked={checkedItems[index]} onChange={() => handleCheckItem(index)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              </td>
              <td className="border-t border-slate-200 px-4 py-4">{vin.num_vin}</td>
              <td className="border-t border-slate-200 px-4 py-4">{vin.nom}</td>
              <td className="border-t border-slate-200 px-4 py-4">{vin.prix}</td>
              <td className={`border-t border-slate-200 px-4 py-4 font-bold ${getQuantiteColor(vin.quantite)}`}>{vin.quantite}</td>
              <td className="border-t border-slate-200 text-slate-500 px-4 py-4 hover:text-slate-700"><FontAwesomeIcon icon={faPencil} /></td>
              <td className="border-t border-slate-200 text-slate-500 px-4 py-4 hover:text-slate-700"><FontAwesomeIcon icon={faTrash} /></td>
              <td className="border-t border-slate-200 text-slate-500 px-4 py-4 hover:text-slate-700"><FontAwesomeIcon icon={faEllipsisH} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <div>
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="text-pink-500 px-2 py-1 rounded hover:bg-pink-100 disabled:opacity-50">
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </button>
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="text-pink-500 px-2 py-1 rounded hover:bg-pink-100 disabled:opacity-50">Préc</button>
        </div>
        <div>
          <p className="text-gray-600">Page {currentPage} sur {totalPages}</p>
        </div>
        <div>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="text-pink-500 px-2 py-1 rounded hover:bg-pink-100 disabled:opacity-50">Suiv</button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="text-pink-500 px-2 py-1 rounded hover:bg-pink-100 disabled:opacity-50">
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </button>
        </div>
      </div>
   
    </div>
  );
}
