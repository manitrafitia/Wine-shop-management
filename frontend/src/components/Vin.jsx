import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faPencil, faTrash, faPlus, faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import useTableFunctions from './TableFunctions';
import AddVin from './AddVin'; 
import EditVin from './EditVin';

export default function Vin() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedVinData, setSelectedVinData] = useState(null);

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
  const [isCheckedAll, setIsCheckedAll] = useState(false); // État pour suivre si toutes les cases sont cochées
  const [checkedItems, setCheckedItems] = useState([]); // État pour suivre les cases cochées

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/vin');
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
      const response = await axios.get('http://localhost:3000/vin');
      setData(response.data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données :', error);
    }
  };

  // Déclarez un état pour suivre l'ID du vin sélectionné pour la modification
  const [selectedVinId, setSelectedVinId] = useState(null);

  // Fonction pour afficher le composant EditVin avec les données du vin sélectionné
  const handleEditVin = async (num_vin, nom) => {
    try {
      const response = await axios.get(`http://localhost:3000/vin/${num_vin}`);
      setSelectedVinData(response.data);
      setSelectedVinId(num_vin); // Définissez l'ID du vin sélectionné
      setShowEditVinDialog(true); // Afficher le composant EditVin
    } catch (error) {
      console.error('Erreur lors de la récupération des données du vin à modifier :', error);
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

  // Filtrer les données en fonction de la valeur de recherche
  const filteredData = sortedData.filter((vin) =>
    vin.nom.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Calculer l'index de début et de fin des éléments à afficher pour la page actuelle
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const [vinToEdit, setVinToEdit] = useState(null);

  const [showAddVinDialog, setShowAddVinDialog] = useState(false); // État pour afficher la boîte de dialogue Ajouter un vin
  const [showEditVinDialog, setShowEditVinDialog] = useState(false);

  
  return (
    <div className="overflow-x-auto m-4 bg-white rounded-2xl p-4">
      <p className="text-2xl text-slate-700">Liste des vins</p>
      <div className="flex justify-between mb-4 mt-4">
        <div>
          <input 
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Rechercher ..."
            className="w-auto border border-slate-200 rounded-2xl px-4 py-2"
          />
        </div>
        <div>
          <button className="border border-slate-500 text-slate-500 font-semibold px-4 mr-2 py-2 rounded-xl hover:bg-slate-100" onClick={() => setShowAddVinDialog(true)}> <FontAwesomeIcon className='mr-2' icon={faPlus} />Ajouter</button>
          <button className="bg-slate-100 px-4 py-2 rounded-xl font-semibold hover:bg-slate-200"> <FontAwesomeIcon className='mr-2' icon={faTrash} />Supprimer</button>
        </div>
      </div>
      <table className="table-auto min-w-full z-3">
        <thead className='text-left text-slate-900 border-t border-slate-100'>
          <tr>
            {/* <th className="px-4 py-4">
              <input id="header-checkbox" type="checkbox" checked={isCheckedAll} onChange={handleCheckAll} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            </th> */}
            <th className="px-4 py-4  font-semibold" onClick={() => handleSort('num_vin')}>
              #<FontAwesomeIcon className="float-right text-slate-200 hover:text-slate-600" icon={sortColumn === 'num_vin' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4  font-semibold" onClick={() => handleSort('nom')}>
              NOM<FontAwesomeIcon className="float-right text-slate-200 hover:text-slate-600" icon={sortColumn === 'nom' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4  font-semibold" onClick={() => handleSort('prix')}>
              PRIX (€)<FontAwesomeIcon className="float-right text-slate-200 hover:text-slate-600" icon={sortColumn === 'prix' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4  font-semibold" onClick={() => handleSort('quantite')}>
              QUANTITE<FontAwesomeIcon className="float-right text-slate-200 hover:text-slate-600" icon={sortColumn === 'quantite' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4"></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* Afficher les données paginées */}
          {paginatedData.map((vin, index) => (
            <tr key={index} className=' text-slate-900 text-sm'>
              {/* <td className="border-t border-slate-100 px-4 py-4">
                <input id={`checkbox-${index}`} type="checkbox" checked={checkedItems[index]} onChange={() => handleCheckItem(index)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              </td> */}
              <td className="border-t border-slate-100 px-4 py-4"> <img src={vin.photo} alt={vin.nom} className="w-10 rounded-full" /></td>       
              <td className="border-t border-slate-100 px-4 py-4">{vin.num_vin}</td>
              <td className="border-t border-slate-100 px-4 py-4">{vin.nom}</td>
              <td className="border-t border-slate-100 px-4 py-4">{vin.prix}</td>
              <td className={`border-t border-slate-100 px-4 py-4`}>{vin.quantite}</td>
              <td className="border-t border-slate-100  px-4 py-4 text-slate-500 hover:text-slate-900 hover:text-slate-900">
                <button onClick={() => handleEditVin(vin.num_vin, vin.nom)}>
                  Modifier
                </button>
              </td>
              <td className="border-t border-slate-100  px-4 py-4 text-slate-500 hover:text-slate-900">
                Supprimer
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
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
      {showAddVinDialog && <AddVin onClose={() => setShowAddVinDialog(false)} updateData={handleUpdateData} />} 
      {showEditVinDialog && (
        <EditVin
          onClose={() => setShowEditVinDialog(false)}
          updateData={handleUpdateData}
          vinId={selectedVinId}
          vinData={selectedVinData}
        />
      )}
    </div>
  );
}
