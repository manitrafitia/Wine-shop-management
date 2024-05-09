import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPlus, faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import useTableFunctions from '../TableFunctions';
import AddCommande from './Add/AddCommande';
import EditCommande from './Edit/EditCommande'; // Importez le composant EditCommande ici

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('fr-FR', options).format(date);
  return formattedDate;
};

export default function Commande() {
  const [sortType, setSortType] = useState('asc');
  const [sortColumn, setSortColumn] = useState('');
  const [itemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [vinList, setVinList] = useState([]);
  const [showAddCommandeDialog, setShowAddCommandeDialog] = useState(false);
  const [showEditCommandeDialog, setShowEditCommandeDialog] = useState(false); // Nouvel état pour afficher la boîte de dialogue de modification
  const [selectedCommande, setSelectedCommande] = useState(null); // Nouvel état pour suivre la commande actuellement modifiée
  const [showPaidOnly, setShowPaidOnly] = useState(false);
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [showInProgressOnly, setShowInProgressOnly] = useState(false);

  useEffect(() => {
    const fetchVins = async () => {
      try {
        const response = await axios.get('http://localhost:3000/vin');
        setVinList(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données des vins :', error);
      }
    };
  
    fetchVins();
  }, []);

  const {
    data,
    setData,
  } = useTableFunctions();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/commande');
        setData(response.data);
        setCheckedItems(new Array(response.data.length).fill(false));
        setIsCheckedAll(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, [setData]);

  const handleUpdateData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/commande');
      setData(response.data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données :', error);
    }
  };

  const handleSort = (columnName) => {
    if (columnName === sortColumn) {
      setSortType(sortType === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnName);
      setSortType('asc');
    }
  };

  const handleEditCommande = (commande) => {
    setSelectedCommande(commande); // Mettre à jour la commande sélectionnée
    setShowEditCommandeDialog(true); // Afficher la boîte de dialogue de modification
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const paginatedData = data.slice(startIndex, endIndex);
  const filteredCommandes = showPaidOnly
    ? paginatedData.filter(commande => commande.paiement === 2)
    : showUnpaidOnly
      ? paginatedData.filter(commande => commande.paiement === 1)
      : statusFilter
        ? paginatedData.filter(commande => {
            if (statusFilter === "received") {
              return commande.statut === 2;
            } else {
              return commande.statut === 1;
            }
          })
        : showInProgressOnly
          ? paginatedData.filter(commande => commande.statut === 1)
          : paginatedData;

  const sortedCommandes = filteredCommandes.sort((a, b) => {
    const columnA = a[sortColumn];
    const columnB = b[sortColumn];
    let comparison = 0;
  
    if (columnA > columnB) {
      comparison = 1;
    } else if (columnA < columnB) {
      comparison = -1;
    }
  
    return sortType === 'desc' ? comparison * -1 : comparison;
  }).map((commande, index) => (
    <tr key={index}>
      <td className="border-t border-gray-200 px-2 py-2">{commande.num_commande}</td>
      <td className="border-t border-gray-200 px-2 py-2">{vinList.find(vin => vin._id === commande.vin)?.nom}</td>
      <td className="border-t border-gray-200 px-2 py-2">{commande.quantite_vendue}</td>
      <td className="border-t border-gray-200 px-2 py-2">{formatDate(commande.date)}</td>
      <td className="border-t border-gray-200 px-2 py-2">{commande.mode_paiement}</td>
      <td className="border-t border-gray-200 px-2 py-2">
        <div className={commande.paiement === 1 ? "bg-red-500 text-white rounded-xl w-20 text-sm text-center font-semibold" : "font-semibold text-white bg-green-500 text-sm rounded-xl w-20 text-center"}>
          {commande.paiement === 1 ? "Non payé" : "Payé"}
        </div>
      </td>
      <td className="border-t border-gray-200 px-2 py-2">
        <div className={commande.statut === 1 ? "bg-gray-200 rounded-xl w-20 text-sm text-center font-semibold" : "font-semibold bg-orange-500 text-white text-sm rounded-xl w-20 text-center"}>
          {commande.statut === 1 ? "En cours" : "Reçu"}
        </div>
      </td>
      <td className="border-t border-gray-200 px-2 py-2">{commande.montant_total}</td>
      <td className="border-t border-charade-100 px-2 py-2 text-charade-500 hover:text-charade-900">
        <button onClick={() => handleEditCommande(commande)}>Modifier</button>
      </td>
      {/* <td className="border-t border-slate-100 px-2 py-2 text-slate-500 hover:text-slate-900">
        <button><FontAwesomeIcon className="w-10" icon={faDownload} /></button>
      </td> */}
    </tr>
  ));

  const totalPages = Math.ceil(filteredCommandes.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="overflow-x-auto m-4 bg-white rounded-2xl p-4">
        <span className='text-slate-400 text-sm'>Dashboard \ </span>
        <span className='text-sm font-bold text-slate-400'>Commandes </span>
        <div className="flex justify-between mb-4">
          <p className="text-2xl text-gray-700">Liste des commandes</p>
          <div>
            <button className="border border-charade-500 text-charade-500 font-semibold px-2 mr-2 py-1 rounded-xl hover:bg-charade-100" onClick={() => setShowAddCommandeDialog(true)}> <FontAwesomeIcon className='mr-2' icon={faPlus} />Ajouter</button>
          </div>
        </div>
        <div className='mt-4 mx-4'>
          <button onClick={() => setShowPaidOnly(!showPaidOnly)} className="bg-gray-200 ml-2 font-semibold px-4 py-1 rounded hover:bg-gray-300">
            {showPaidOnly ? "Payés" : "Payés"}
          </button>
          <button onClick={() => setShowUnpaidOnly(!showUnpaidOnly)} className="bg-gray-200 ml-2 font-semibold px-4 py-1 rounded hover:bg-gray-300">
            {showUnpaidOnly ? "Non Payés" : "Non Payés"}
          </button>
          <button
            className="bg-gray-200 ml-2 font-semibold px-4 py-1 rounded hover:bg-gray-300"
            onClick={() => setStatusFilter(statusFilter === "received" ? "" : "received")}
          >
            {statusFilter === "received" ? "Reçu" : "Reçu"}
          </button>
          <button
            className="bg-gray-200 ml-2 font-semibold px-4 py-1 rounded hover:bg-gray-300"
            onClick={() => setShowInProgressOnly(!showInProgressOnly)}
          >
            {showInProgressOnly ? "En cours" : "En cours"}
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-2xl p-4 m-4">
        <table className="table-auto min-w-full z-3">
          <thead className='text-left text-charade-900 border-charade-100'>
            <tr>
              <th className="px-2 py-2 font-semibold" onClick={() => handleSort('num_commande')}>
                #<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'num_commande' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
              </th>
              <th className="px-2 py-2 font-semibold" onClick={() => handleSort('num_commande')}>
                VIN<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'num_commande' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
              </th>
              <th className="px-2 py-2 font-semibold" onClick={() => handleSort('quantite_vendue')}>
                QUANTITE<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'quantite_vendue' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
              </th>
              <th className="px-2 py-2 font-semibold" onClick={() => handleSort('date')}>
                DATE<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'date' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
              </th>
              <th className="px-2 py-2 font-semibold" onClick={() => handleSort('mode_paiement')}>
                MODE DE PAIEMENT<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'mode_paiement' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
              </th>
              <th className="px-2 py-2 font-semibold" onClick={() => handleSort('mode_paiement')}>
                PAIEMENT<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'mode_paiement' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
              </th>
              <th className="px-2 py-2 font-semibold" onClick={() => handleSort('mode_paiement')}>
                STATUT<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'mode_paiement' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
              </th>
              <th className="px-2 py-2 font-semibold" onClick={() => handleSort('montant_total')}>
                TOTAL (€) <FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'montant_total' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedCommandes}
          </tbody>
        </table>

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
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="text-charade-500 px-2 py-1 rounded hover:bg-charade-100">
              <FontAwesomeIcon icon={faAngleDoubleRight} />
            </button>
          </div>
        </div>

        {/* Affichage de la boîte de dialogue de modification */}
        {showEditCommandeDialog && (
          <EditCommande
            commande={selectedCommande}
            onClose={() => setShowEditCommandeDialog(false)}
            updateData={handleUpdateData}
          />
        )}

        {/* Affichage de la boîte de dialogue d'ajout */}
        {showAddCommandeDialog && (
          <AddCommande
            onClose={() => setShowAddCommandeDialog(false)}
            updateData={handleUpdateData}
          />
        )}
      </div>
    </div>
  );
}
