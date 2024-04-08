import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faPencil, faTrash, faPlus, faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import useTableFunctions from './TableFunctions';

export default function Production() {
  const [sortType, setSortType] = useState('asc');
  const [sortColumn, setSortColumn] = useState('');
  const {
    data,
    setData,
    setShowDialogIndex,
    setDialogPosition,
    currentPage,
    paginate,
    totalPages,
  } = useTableFunctions();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/production');
        setData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, []);

  const handleEllipsisClick = (index, event) => {
    const iconRect = event.target.getBoundingClientRect();
    setShowDialogIndex(index);
    setDialogPosition({ top: iconRect.bottom, left: iconRect.left - 75 });
  };

  const handleCloseDialog = () => {
    setShowDialogIndex(-1);
  };

  const handleSort = (columnName) => {
    if (columnName === sortColumn) {
      setSortType(sortType === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnName);
      setSortType('asc');
    }
  };

  const sortedProductions = data.slice().sort((a, b) => {
    const columnA = a[sortColumn];
    const columnB = b[sortColumn];
    let comparison = 0;

    if (columnA > columnB) {
      comparison = 1;
    } else if (columnA < columnB) {
      comparison = -1;
    }

    return sortType === 'desc' ? comparison * -1 : comparison;
  }).map((production, index) => (
    <tr key={index}>
      <td className="border-t border-slate-200 px-4 py-4">
        <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600" />
      </td>
      <td className="border-t border-slate-200 px-4 py-4">{production.num_prod}</td>
      <td className="border-t border-slate-200 px-4 py-4">{production.vin}</td>
      <td className="border-t border-slate-200 px-4 py-4">{production.quantite}</td>
      <td className="border-t border-slate-200 px-4 py-4">{production.date_prod}</td>
      <td className="border-t border-slate-200 px-4 py-4">{production.region}</td>
      <td className="border-t border-slate-200 text-slate-500 px-4 py-4 hover:text-slate-700"><FontAwesomeIcon icon={faPencil} /></td>
      <td className="border-t border-slate-200 text-slate-500 px-4 py-4 hover:text-slate-700"><FontAwesomeIcon icon={faTrash} /></td>
      <td className="border-t border-slate-200 text-slate-500 px-4 py-4 hover:text-slate-700"><FontAwesomeIcon icon={faEllipsisH} /></td>
    </tr>
  ));

  return (
    <div className="overflow-x-auto m-4 bg-white rounded-lg p-4">
      <div className="flex justify-between mb-4">
        <p className="text-2xl text-slate-700">Liste des productions</p>
        <div>
          <button className="bg-indigo-500 text-white px-4 mr-2 py-2 rounded hover:bg-indigo-600"> <FontAwesomeIcon className='mr-2' icon={faPlus} />Ajouter une production</button>
          <button className="bg-slate-100 px-4 py-2 rounded hover:bg-slate-200"> <FontAwesomeIcon className='mr-2' icon={faTrash} />Supprimer tout</button>
        </div>
      </div>
      <table className="table-auto min-w-full z-3">
        <thead className='text-indigo-500 text-left'>
          <tr>
            <th className="px-4 py-4">
              <input id="header-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600" />
            </th>
            <th className="px-4 py-4" onClick={() => handleSort('num_prod')}>
              #<FontAwesomeIcon className="float-right text-indigo-200 hover:text-indigo-600" icon={sortColumn === 'num_prod' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4" onClick={() => handleSort('vin')}>
              Vin<FontAwesomeIcon className="float-right text-indigo-200 hover:text-indigo-600" icon={sortColumn === 'vin' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4" onClick={() => handleSort('quantite')}>
              Quantité<FontAwesomeIcon className="float-right text-indigo-200 hover:text-indigo-600" icon={sortColumn === 'quantite' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4" onClick={() => handleSort('date_prod')}>
              Date production<FontAwesomeIcon className="float-right text-indigo-200 hover:text-indigo-600" icon={sortColumn === 'date_prod' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4" onClick={() => handleSort('region')}>
              Région<FontAwesomeIcon className="float-right text-indigo-200 hover:text-indigo-600" icon={sortColumn === 'region' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4"></th>
          </tr>
        </thead>
        <tbody>
          {sortedProductions}
        </tbody>
      </table>

      {/* Pagination */}
      <nav aria-label="Page navigation example">
        <ul className="flex items-center -space-x-px h-10 text-base float-right mt-2">
          {/* Bouton de page précédente */}
          <li>
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-slate-500 bg-white border border-e-0 border-slate-300 rounded-s-lg hover:bg-slate-100 hover:text-slate-700">
              <FontAwesomeIcon icon={faAngleDoubleLeft} />
            </button>
          </li>

          {/* Affichage des pages */}
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index}>
              <button onClick={() => paginate(index + 1)} className={`flex items-center justify-center px-4 h-10 leading-tight text-slate-500 bg-white border border-slate-300 hover:bg-slate-100 hover:text-slate-700 ${currentPage === index + 1 ? 'bg-indigo-50 text-indigo-600' : ''}`}>
                {index + 1}
              </button>
            </li>
          ))}

          {/* Bouton de page suivante */}
          <li>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center px-4 h-10 leading-tight text-slate-500 bg-white border border-slate-300 rounded-e-lg hover:bg-slate-100 hover:text-slate-700">
              <FontAwesomeIcon icon={faAngleDoubleRight} />
            </button>
          </li>
        </ul>
      </nav>

    </div>
  );
}
