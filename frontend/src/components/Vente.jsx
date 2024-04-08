import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faPencil, faTrash, faPlus, faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import useTableFunctions from './TableFunctions';

export default function Vente() {
  const [sortType, setSortType] = useState('asc');
  const [sortColumn, setSortColumn] = useState('');
  const [itemsPerPage] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);

  const {
    data,
    setData,
    setShowDialogIndex,
    setDialogPosition,
  } = useTableFunctions();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/vente');
        setData(response.data);
        setIsCheckedAll(false); // Reset isCheckedAll when data is loaded
        setCheckedItems(new Array(response.data.length).fill(false)); // Reset checkedItems when data is loaded
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, [setData]);

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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const paginatedData = data.slice(startIndex, endIndex);

  const sortedVentes = paginatedData.sort((a, b) => {
    const columnA = a[sortColumn];
    const columnB = b[sortColumn];
    let comparison = 0;

    if (columnA > columnB) {
      comparison = 1;
    } else if (columnA < columnB) {
      comparison = -1;
    }

    return sortType === 'desc' ? comparison * -1 : comparison;
  }).map((vente, index) => (
    <tr key={index}>
      <td className="border-t border-gray-200 px-4 py-4">
        <input id={`checkbox-${index}`} type="checkbox" checked={checkedItems[index]} onChange={() => handleCheckItem(index)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
      </td>
      <td className="border-t border-gray-200 px-4 py-4">{vente.num_vente}</td>
      <td className="border-t border-gray-200 px-4 py-4">{vente.quantite_vendue}</td>
      <td className="border-t border-gray-200 px-4 py-4">{vente.date}</td>
      <td className="border-t border-gray-200 px-4 py-4">{vente.mode_paiement}</td>
      <td className="border-t border-gray-200 px-4 py-4">{vente.montant_total}</td>
      <td className="border-t border-gray-200 text-gray-500 px-4 py-4 hover:text-gray-700"><FontAwesomeIcon icon={faPencil} /></td>
      <td className="border-t border-gray-200 text-gray-500 px-4 py-4 hover:text-gray-700"><FontAwesomeIcon icon={faTrash} /></td>
      <td className="border-t border-gray-200 text-gray-500 px-4 py-4 hover:text-gray-700"><FontAwesomeIcon icon={faEllipsisH} /></td>
    </tr>
  ));

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setIsCheckedAll(checkedItems.every(item => item));
  }, [checkedItems]);

  return (
    <div className="overflow-x-auto m-4 bg-white rounded-lg p-4">
      <div className="flex justify-between mb-4">
        <p className="text-2xl text-gray-700">Liste des ventes</p>
        <div>
          <button className="bg-indigo-500 text-white px-4 mr-2 py-2 rounded hover:bg-indigo-600"> <FontAwesomeIcon className='mr-2' icon={faPlus} />Ajouter une vente</button>
          <button className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"> <FontAwesomeIcon className='mr-2' icon={faTrash} />Supprimer tout</button>
        </div>
      </div>
      <table className="table-auto min-w-full z-3">
        <thead className='text-indigo-500 text-left'>
          <tr>
            <th className="px-4 py-4">
              <input id="default-checkbox" type="checkbox" checked={isCheckedAll} onChange={handleCheckAll} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            </th>
            <th className="px-4 py-4" onClick={() => handleSort('num_vente')}>
              #<FontAwesomeIcon className="float-right text-indigo-200 hover:text-indigo-600" icon={sortColumn === 'num_vente' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4" onClick={() => handleSort('quantite_vendue')}>
              Quantité<FontAwesomeIcon className="float-right text-indigo-200 hover:text-indigo-600" icon={sortColumn === 'quantite_vendue' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4" onClick={() => handleSort('date')}>
              Date vente<FontAwesomeIcon className="float-right text-indigo-200 hover:text-indigo-600" icon={sortColumn === 'date' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4" onClick={() => handleSort('mode_paiement')}>
              Mode de paiement<FontAwesomeIcon className="float-right text-indigo-200 hover:text-indigo-600" icon={sortColumn === 'mode_paiement' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4" onClick={() => handleSort('montant_total')}>
              Total<FontAwesomeIcon className="float-right text-indigo-200 hover:text-indigo-600" icon={sortColumn === 'montant_total' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4"></th>
          </tr>
        </thead>
        <tbody>
          {sortedVentes}
        </tbody>
      </table>

      {/* Pagination */}
      <nav aria-label="Page navigation example">
        <ul className="flex items-center -space-x-px h-10 text-base float-right mt-2">
          {/* Bouton de page précédente */}
          <li>
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700">
              <FontAwesomeIcon icon={faAngleDoubleLeft} />
            </button>
          </li>

          {/* Affichage des pages */}
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index}>
              <button onClick={() => paginate(index + 1)} className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${currentPage === index + 1 ? 'bg-indigo-50 text-indigo-600' : ''}`}>
                {index + 1}
              </button>
            </li>
          ))}

          {/* Bouton de page suivante */}
          <li>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700">
              <FontAwesomeIcon icon={faAngleDoubleRight} />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
