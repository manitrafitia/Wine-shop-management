import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faPencil, faTrash, faPlus, faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import useTableFunctions from '../TableFunctions';
import AddVin from './Add/AddVin'; 
import EditVin from './Edit/EditVin';
import ConfirmDelete from '../ConfirmDelete'; 
import Success from '../Success'


export default function Vin() {
  const [searchValue, setSearchValue] = useState('');
  const [selectedVinData, setSelectedVinData] = useState(null);
  const [vinToDelete, setVinToDelete] = useState(null);


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


  const handleDeleteVin = async () => {
    try {
      await axios.delete(`http://localhost:3000/vin/${vinToDelete.num_vin}`);
      handleUpdateData(); // Mettre à jour les données après la suppression
      setShowConfirmDeleteDialog(false); // Fermer la boîte de dialogue de confirmation
      showSuccessMessage();
    } catch (error) {
      console.error('Erreur lors de la suppression du vin :', error);
    }
  };

  
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
      showSuccessMessage(); // Afficher la boîte de dialogue de succès
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
    return quantite < 10 ? 'text-red-500' : 'text-charade-500';
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
  vin && vin.nom && vin.nom.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Calculer l'index de début et de fin des éléments à afficher pour la page actuelle
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const [vinToEdit, setVinToEdit] = useState(null);

  const [showAddVinDialog, setShowAddVinDialog] = useState(false); // État pour afficher la boîte de dialogue Ajouter un vin
  const [showEditVinDialog, setShowEditVinDialog] = useState(false);

  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const handleOpenConfirmDeleteDialog = (vin) => {
    setVinToDelete(vin);
    setShowConfirmDeleteDialog(true);
  };
  
  
  const handleCloseConfirmDeleteDialog = () => {
    setShowConfirmDeleteDialog(false);
  };
  
  const [showSuccess, setShowSuccess] = useState(false); // État pour contrôler l'affichage du composant Success

  // Fonction pour afficher le composant Success
  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000); // Masquer le composant Success après 2 secondes
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case '1':
        return 'Vin rouge';
      case '2':
        return 'Vin blanc';
      case '3':
        return 'Vin rosé';
      default:
        return '';
    }
  };
  

  return (
    <div>
      <div  className='overflow-x-auto m-4 bg-white rounded-2xl p-4'>
      <span className='text-slate-400 text-sm'>Dashboard \ </span>
          <span className='text-sm font-bold text-slate-400'>Vins </span>
      <p className="text-2xl text-charade-700 pt-2">Liste des vins</p>
  <div className="flex flex-col sm:flex-row justify-between mb-4 mt-4"> {/* Utilisation des classes flex pour gérer les colonnes sur les écrans larges */}
    <div className="mb-4 sm:mb-0"> {/* Utilisation de mb-4 pour l'espacement vertical */}
      <input 
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Rechercher ..."
        className="w-full sm:w-auto border border-charade-200 rounded-xl px-4 py-1" /> {/* Utilisation de w-full sur les petits écrans et w-auto sur les grands écrans */}
    </div>
    <div> {/* Utilisation des classes flex pour gérer les boutons sur les petits écrans */}
      <button className="border border-charade-500 text-charade-500 font-semibold px-2 mr-2 py-1 rounded-xl hover:bg-charade-100" onClick={() => setShowAddVinDialog(true)}>
        <FontAwesomeIcon className='mr-2' icon={faPlus} />Ajouter
      </button>
      {/* <button className="bg-charade-100 px-4 py-2 rounded-xl font-semibold hover:bg-charade-200">
        <FontAwesomeIcon className='mr-2' icon={faTrash} />Supprimer
      </button> */}
    </div>
  </div>
      </div>
      <div  className='overflow-x-auto m-4 bg-white rounded-2xl p-4'>
      <table className="table-auto min-w-full z-3">
        <thead className='text-left text-charade-900 border-charade-100'>
          <tr>
            {/* <th></th> */}
            {/* <th className="px-2 py-2">
              <input id="header-checkbox" type="checkbox" checked={isCheckedAll} onChange={handleCheckAll} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            </th> */}
            <th className="px-2 py-2  font-semibold" onClick={() => handleSort('num_vin')}>
              #<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'num_vin' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-2 py-2  font-semibold" onClick={() => handleSort('nom')}>
              NOM<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'nom' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-2 py-2  font-semibold" onClick={() => handleSort('nom')}>
              TYPE<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'nom' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-2 py-2  font-semibold" onClick={() => handleSort('prix')}>
              PRIX (€)<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'prix' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-2 py-2  font-semibold" onClick={() => handleSort('quantite')}>
              QUANTITE<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'quantite' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-2 py-2"></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* Afficher les données paginées */}
          {paginatedData.map((vin, index) => (
            <tr key={index}>
              {/* <td className="border-t border-charade-100 px-2 py-2">
                <input id={`checkbox-${index}`} type="checkbox" checked={checkedItems[index]} onChange={() => handleCheckItem(index)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              </td> */}
              {/* <td className="border-t border-charade-100 px-2 py-2">  
               <img src={vin.photo} alt={vin.nom} className="w-10 rounded-full" /></td>        */}
              <td className="border-t border-charade-100 px-2 py-2">{vin.num_vin}</td>
              <td className="border-t border-charade-100 px-2 py-2">{vin.nom}</td>
              <td className="border-t border-charade-100 px-2 py-2">{getTypeLabel(vin.type)}</td>
              <td className="border-t border-charade-100 px-2 py-2">{vin.prix}</td>
              <td className={`border-t border-charade-100 px-2 py-2`}>{vin.quantite}</td>
              <td className="border-t border-charade-100  px-2 text-charade-500 hover:text-charade-900 hover:text-charade-900">
                <button className='bg-white shadow p-1 m-1 rounded' onClick={() => handleEditVin(vin.num_vin, vin.nom)}>
                  Modifier
                </button>
              </td>
              <td className="border-t border-charade-100  px-2 py-2 text-charade-500 hover:text-charade-900">
              <button onClick={() => handleOpenConfirmDeleteDialog(vin)}>
  Supprimer
</button>


</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <div>
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="text-charade-500 px-2 py-1 rounded hover:bg-charade-100 disabled:opacity-50">
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </button>
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="text-charade-500 px-2 py-1 rounded hover:bg-charade-100 disabled:opacity-50">Préc</button>
        </div>
        <div>
          <p className="text-gray-600">Page {currentPage} sur {totalPages}</p>
        </div>
        <div>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="text-charade-500 px-2 py-1 rounded hover:bg-charade-100 disabled:opacity-50">Suiv</button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="text-charade-500 px-2 py-1 rounded hover:bg-charade-100 disabled:opacity-50">
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
 {showConfirmDeleteDialog && <ConfirmDelete onClose={handleCloseConfirmDeleteDialog} onDelete={handleDeleteVin} />}
 {showSuccess && <Success />}
      </div>
    </div>
  );
}
