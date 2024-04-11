import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faPencil, faTrash, faPlus, faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import useTableFunctions from './TableFunctions';
import AddClient from './AddClient'; 
import EditClient from './EditClient';

export default function Client() {
  const [selectedClientData, setSelectedClientData] = useState(null);

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
        const response = await axios.get('http://localhost:3000/client');
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
      const response = await axios.get('http://localhost:3000/client');
      setData(response.data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données :', error);
    }
  };

// Déclarez un état pour suivre l'ID du client sélectionné pour la modification
const [selectedClientId, setSelectedClientId] = useState(null);

// Fonction pour afficher le composant EditClient avec les données du client sélectionné
const handleEditClient = async (num_client, nom) => {
  try {
    const response = await axios.get(`http://localhost:3000/client/${num_client}`);
    setSelectedClientData(response.data);
    setSelectedClientId(num_client); // Définissez l'ID du client sélectionné
    setShowEditClientDialog(true); // Afficher le composant EditClient
  } catch (error) {
    console.error('Erreur lors de la récupération des données du client à modifier :', error);
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


  const [showAddClientDialog, setShowAddClientDialog] = useState(false); // État pour afficher la boîte de dialogue Ajouter un client

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

  const [clientToEdit, setClientToEdit] = useState(null);

  const [showEditClientDialog, setShowEditClientDialog] = useState(false);

  
  return (
    <div className="overflow-x-auto m-4 bg-white rounded-2xl p-4">
      <div className="flex justify-between mb-4">
        <p className="text-2xl text-slate-700">Liste des clients</p>
        <div>
        <button className="border border-slate-500 text-slate-500 font-semibold px-4 mr-2 py-2 rounded-xl hover:bg-slate-100" onClick={() => setShowAddClientDialog(true)}> <FontAwesomeIcon className='mr-2' icon={faPlus} />Ajouter</button>
          <button className="bg-slate-100 px-4 py-2 rounded-xl font-semibold hover:bg-slate-200"> <FontAwesomeIcon className='mr-2' icon={faTrash} />Supprimer</button>
        </div>
      </div>
      <table className="table-auto min-w-full z-3">
        <thead className='text-left text-slate-900 border-t border-slate-100'>
          <tr>
            {/* En-têtes de colonne avec options de tri */}
            <th className="px-4 py-4">
              <input id="header-checkbox" type="checkbox" checked={isCheckedAll} onChange={handleCheckAll} className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600" />
            </th>
            <th className="px-4 py-4 font-semibold" onClick={() => handleSort('num_client')}>
              #<FontAwesomeIcon className="float-right text-slate-200 hover:text-slate-600" icon={sortColumn === 'num_client' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4 font-semibold" onClick={() => handleSort('nom')}>
              NOM<FontAwesomeIcon className="float-right text-slate-200 hover:text-slate-600" icon={sortColumn === 'nom' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4 font-semibold" onClick={() => handleSort('adresse')}>
              ADRESSE<FontAwesomeIcon className="float-right text-slate-200 hover:text-slate-600" icon={sortColumn === 'adresse' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4 font-semibold" onClick={() => handleSort('email')}>
              EMAIL<FontAwesomeIcon className="float-right text-slate-200 hover:text-slate-600" icon={sortColumn === 'email' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4 font-semibold" onClick={() => handleSort('telephone')}>
              TEL<FontAwesomeIcon className="float-right text-slate-200 hover:text-slate-600" icon={sortColumn === 'telephone' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4 font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {/* Afficher les données paginées */}
          {paginatedData.map((client, index) => (
            <tr key={index} className=' text-slate-600 font-semibold'>
              {/* Contenu de chaque ligne */}
              <td className="border-t border-slate-100 px-4 py-4">
                <input id={`checkbox-${index}`} type="checkbox" checked={checkedItems[index]} onChange={() => handleCheckItem(index)} className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600" />
              </td>
              <td className="border-t border-slate-100 px-4 py-4">{client.num_client}</td>
              <td className="border-t border-slate-100 px-4 py-4">{client.nom}</td>
              <td className="border-t border-slate-100 px-4 py-4">{client.adresse}</td>
              <td className="border-t border-slate-100 px-4 py-4">{client.email}</td>
              <td className="border-t border-slate-100 px-4 py-4">{client.telephone}</td>
              <td className="border-t border-slate-100  px-4 py-4 hover:text-teal-400">
              <button onClick={() => handleEditClient(client.num_client, client.nom)}>
  <div className='rounded-full bg-teal-500 hover:bg-teal-600 w-6 h-6 flex items-center justify-center'>
    <FontAwesomeIcon className='w-3 h-3 w-3 p-1 pl-1.5 text-white' icon={faPencil} />
  </div>
</button>

</td>

              <td className="border-t border-slate-'00 text-red-400 px-4 py-4 hover:text-red-600">
                <div className='rounded-full bg-red-500 hover:bg-red-800 w-6 h-6'>
                <FontAwesomeIcon className='w-3 h-3 w-3 p-1 pl-1.5 text-white' icon={faTrash} />  
                </div>
                      
                </td>
    
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
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
      {showAddClientDialog && <AddClient onClose={() => setShowAddClientDialog(false)} updateData={handleUpdateData} />} 
      {showEditClientDialog && (
        <EditClient
          onClose={() => setShowEditClientDialog(false)}
          updateData={handleUpdateData}
          clientId={selectedClientId}
          clientData={selectedClientData}
        />
      )}

    </div>
  );
}
