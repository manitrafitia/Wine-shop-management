import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faPencil, faTrash, faPlus, faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import useTableFunctions from './TableFunctions';
import AddProduction from './AddProduction'; 
import EditProduction from './EditProduction';

export default function Production() {
  const [selectedProduction, setSelectedProduction] = useState(null);

  const {
    data,
    setData,
    setShowDialogIndex,
    setDialogPosition,
  } = useTableFunctions();
  const [totalPages, setTotalPages] = useState(0);
  const [sortType, setSortType] = useState('asc');
  const [sortColumn, setSortColumn] = useState('');
  const [itemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/production');
        setData(response.data);
        setCheckedItems(new Array(response.data.length).fill(false));
        setIsCheckedAll(false);
        const totalPagesCount = Math.ceil(response.data.length / itemsPerPage);
        setTotalPages(totalPagesCount);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, [setData]);

  const handleUpdateData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/production');
      setData(response.data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données :', error);
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

  const [showAddProductionDialog, setShowAddProductionDialog] = useState(false);

  useEffect(() => {
    setIsCheckedAll(checkedItems.every(item => item));
  }, [checkedItems]);

  const handleSort = (columnName) => {
    if (columnName === sortColumn) {
      setSortType(sortType === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnName);
      setSortType('asc');
    }
  };

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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const [selectedProductionId, setSelectedProductionId] = useState(null);
  const [showEditProductionDialog, setShowEditProductionDialog] = useState(false);
  const handleEditProduction = async (num_prod) => {
    try {
      setSelectedProductionId(num_prod);
      // Récupérer les données de la production à éditer
      const response = await axios.get(`http://localhost:3000/production/${num_prod}`);
      // Mettre à jour selectedProduction avec les données de la production à éditer
      setSelectedProduction(response.data);
      // Afficher la boîte de dialogue pour l'édition de la production
      setShowEditProductionDialog(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des données du production à modifier :', error);
    }
  };

  return (
    <div className="overflow-x-auto m-4 bg-white rounded-2xl p-4">
      <div className="flex justify-between mb-4">
        <p className="text-2xl text-slate-700">Liste des productions</p>
        <div>
          <button className="border border-slate-500 text-slate-500 font-semibold px-4 mr-2 py-2 rounded-xl hover:bg-slate-100" onClick={() => setShowAddProductionDialog(true)}> <FontAwesomeIcon className='mr-2' icon={faPlus} />Ajouter</button>
          <button className="bg-slate-100 px-4 py-2 rounded-xl font-semibold hover:bg-slate-200"> <FontAwesomeIcon className='mr-2' icon={faTrash} />Supprimer</button>
        </div>
      </div>
      <table className="table-auto min-w-full z-3">
        <thead className='text-slate-900 text-left border-t border-slate-100'>
          <tr>
            <th className="px-4 py-4">
              <input id="header-checkbox" type="checkbox" checked={isCheckedAll} onChange={handleCheckAll} className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600" />
            </th>
            <th className="px-4 py-4  font-semibold" onClick={() => handleSort('num_prod')}>
              #<FontAwesomeIcon className="float-right text-slate-200 hover:text-slate-600" icon={sortColumn === 'num_prod' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4  font-semibold" onClick={() => handleSort('vin')}>
              VIN<FontAwesomeIcon className="float-right text-slate-200 hover:text-slate-600" icon={sortColumn === 'vin' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4  font-semibold" onClick={() => handleSort('quantite')}>
              QUANTITE<FontAwesomeIcon className="float-right text-slate-200 hover:text-slate-600" icon={sortColumn === 'quantite' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4  font-semibold" onClick={() => handleSort('date_prod')}>
              DATE<FontAwesomeIcon className="float-right text-slate-200 hover:text-slate-600" icon={sortColumn === 'date_prod' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4  font-semibold" onClick={() => handleSort('region')}>
              REGION<FontAwesomeIcon className="float-right text-slate-200 hover:text-slate-600" icon={sortColumn === 'date_prod' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4"></th>
            <th></th>
          </tr>
        </thead>
        <tbody className="text-gray-600 divide-y">
          {paginatedData.map((item, index) => (
            <tr key={index} className=' text-slate-600 font-semibold'>
              <td className="border-t border-slate-100 px-4 py-4">
                <input id={`checkbox-${index}`} type="checkbox" checked={checkedItems[index]} onChange={() => handleCheckItem(index)} className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600" />
              </td>
              <td className="border-t border-slate-100 px-4 py-4">{item.num_prod}</td>
              <td className="border-t border-slate-100 px-4 py-4">{item.vin}</td>
              <td className="border-t border-slate-100 px-4 py-4">{item.quantite}</td>
              <td className="border-t border-slate-100 px-4 py-4">{item.date_prod}</td>
              <td className="border-t border-slate-100 px-4 py-4">{item.region}</td>
              <td className="border-t border-slate-100  px-4 py-4 hover:text-teal-400">
                <button onClick={() => handleEditProduction(item.num_prod)}>
                  <div className='rounded-full bg-teal-500 hover:bg-teal-600 w-6 h-6 flex items-center justify-center'>
                    <FontAwesomeIcon className='w-3 h-3 w-3 p-1 pl-1.5 text-white' icon={faPencil} />
                  </div>
                </button>
              </td>
              <td className="border-t border-slate-100 text-red-400 px-4 py-4 hover:text-red-600">
                <div className='rounded-full bg-red-500 hover:bg-red-800 w-6 h-6'>
                  <FontAwesomeIcon className='w-3 h-3 w-3 p-1 pl-1.5 text-white' icon={faTrash} />  
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <div>
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="text-slate-500 px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-50">
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </button>
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="text-slate-500 px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-50">Préc</button>
        </div>
        <div>
          <p className="text-gray-600">Page {currentPage} sur {totalPages}</p>
        </div>
        <div>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="text-slate-500 px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-50">Suiv</button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="text-slate-500 px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-50">
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </button>
        </div>
      </div>

      {showAddProductionDialog && <AddProduction onClose={() => setShowAddProductionDialog(false)} updateData={handleUpdateData} />}
      {showEditProductionDialog && (
        <EditProduction
          onClose={() => setShowEditProductionDialog(false)}
          updateData={handleUpdateData}
          productionId={selectedProductionId}
          productionData={selectedProduction} // Transmettre les données de la production sélectionnée
        />
      )}

    </div>
  );
}
