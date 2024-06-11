import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { PDFDownloadLink } from '@react-pdf/renderer';
import useTableFunctions from '../TableFunctions';
import AddVente from './Add/AddVente';
import EditVente from './Edit/EditVente';
import PDFDocument from './PDFDocument'; // Import the PDFDocument component
import Success from '../Success';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) {
    return 'Invalid Date';
  }
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  return new Intl.DateTimeFormat('fr-FR', options).format(date);
};

export default function Vente() {
  const [sortType, setSortType] = useState('asc');
  const [sortColumn, setSortColumn] = useState('');
  const [itemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [vinNames, setVinNames] = useState({});
  const [vinPrices, setVinPrices] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => {
        setShowSuccess(false);
    }, 2000); // Masquer le composant Success après 2 secondes
};


  const {
    data,
    setData,
    setShowDialogIndex,
    setDialogPosition,
  } = useTableFunctions();

  const [showAddVenteDialog, setShowAddVenteDialog] = useState(false);
  const [showEditVenteDialog, setShowEditVenteDialog] = useState(false);
  const [editVenteIndex, setEditVenteIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [venteResponse, vinResponse] = await Promise.all([
          axios.get('http://localhost:3000/vente'),
          axios.get('http://localhost:3000/vin')
        ]);
        setData(venteResponse.data);
        const vinNamesMap = vinResponse.data.reduce((acc, vin) => {
          acc[vin.id] = vin.nom;
          return acc;
        }, {});
        const vinPricesMap = vinResponse.data.reduce((acc, vin) => {
          acc[vin.id] = vin.prix; // Assuming 'prix' is the price property in your wine data
          return acc;
        }, {});
        setVinNames(vinNamesMap);
        setVinPrices(vinPricesMap);
        setCheckedItems(new Array(venteResponse.data.length).fill(false));
        setIsCheckedAll(false);
        const totalPagesCount = Math.ceil(venteResponse.data.length / itemsPerPage);
        setTotalPages(totalPagesCount);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };
    fetchData();
  }, [setData]);

  const handleUpdateData = async () => {
    try {
        const response = await axios.get('http://localhost:3000/vente');
        setData(response.data);
        showSuccessMessage(); // Afficher la boîte de dialogue de succès
    } catch (error) {
        console.error('Erreur lors de la mise à jour des données :', error);
    }
};


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

  const sortedVentes = paginatedData
    .sort((a, b) => {
      const columnA = a[sortColumn] || '';
      const columnB = b[sortColumn] || '';
      let comparison = 0;

      if (columnA > columnB) {
        comparison = 1;
      } else if (columnA < columnB) {
        comparison = -1;
      }

      return sortType === 'desc' ? comparison * -1 : comparison;
    })
    .map((vente, index) => (
      <tr key={index}>
        <td className="border-t border-gray-200 px-4 py-4">{vente.num_vente}</td>
        <td className="border-t border-gray-200 px-4 py-4">{vente.client?.num_client || 'Client inconnu'}</td>
        <td className="border-t border-gray-200 px-4 py-4">
          {(vente.vins || []).map((vinItem, vinIndex) => {
            if (!vinItem.vin) {
              console.warn(`vinItem at index ${vinIndex} is missing the 'vin' property`, vinItem);
              return <div key={vinIndex}>Vin inconnu - {vinItem.quantite}</div>;
            }
            return (
              <div key={vinItem.vin._id}>
                {vinItem.vin.prix} €  -  {vinItem.vin.nom}  -  {vinItem.quantite}
              </div>
            );
          })}
        </td>
        <td className="border-t border-gray-200 px-4 py-4">{formatDate(vente.date)}</td>
        <td className="border-t border-gray-200 px-4 py-4">
  {vente.montant_total != null ? Number(vente.montant_total).toFixed(2) : "0.00"} €
</td>

        <td className="border-t border-gray-200 px-4 py-4">
          <PDFDownloadLink
            document={<PDFDocument vente={vente} />}
            fileName={`ticket_${vente.num_vente}.pdf`}
          >
            {({ loading }) => (loading ? 'Génération...' : 'Télécharger')}
          </PDFDownloadLink>
        </td>
      </tr>
    ));

    return (
      <div>
          <div className="overflow-x-auto m-4 bg-white rounded-2xl p-4">
              <span className='text-slate-400 text-sm'>Dashboard \ </span>
              <span className='text-sm font-bold text-slate-400'>Ventes </span>
              <div className="flex justify-between mb-4">
                  <p className="text-2xl text-gray-700">Liste des ventes</p>
                  <div>
                      <button className="border border-charade-500 text-charade-500 font-semibold px-4 mr-2 py-2 rounded-xl hover:bg-charade-100" onClick={() => setShowAddVenteDialog(true)}>
                          <FontAwesomeIcon className='mr-2' icon={faPlus} />Ajouter une vente
                      </button>
                  </div>
              </div>
          </div>
          <div className="overflow-x-auto m-4 bg-white rounded-2xl p-4">
              <table className="table-auto min-w-full z-3">
                  <thead className='text-left text-charade-900 border-charade-100'>
                      <tr>
                          <th className="px-4 py-4 font-semibold" onClick={() => handleSort('num_vente')}>
                              #<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'num_vente' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
                          </th>
                          <th className="px-4 py-4 font-semibold" onClick={() => handleSort('vin')}>
                              Vins<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'vin' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
                          </th>
                          <th className="px-4 py-4 font-semibold" onClick={() => handleSort('client')}>
                              Client<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'client' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
                          </th>
                          <th className="px-4 py-4 font-semibold" onClick={() => handleSort('date')}>
                              Date<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'date' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
                          </th>
                          <th className="px-4 py-4 font-semibold" onClick={() => handleSort('montant_total')}>
                              Montant Total<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'montant_total' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
                          </th>
                          <th className="px-4 py-4 font-semibold">
                              Action
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                      {sortedVentes}
                  </tbody>
              </table>
              <div className="flex justify-between mt-4">
                  <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="text-charade-500 px-2 py-1 rounded hover:bg-charade-100 disabled:opacity-50">
                      <FontAwesomeIcon icon={faAngleDoubleLeft} />
                  </button>
                  <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="text-charade-500 px-2 py-1 rounded hover:bg-charade-100 disabled:opacity-50">Préc</button>
                  <p className="text-gray-600">Page {currentPage} sur {totalPages}</p>
                  <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="text-charade-500 px-2 py-1 rounded hover:bg-charade-100 disabled:opacity-50">Suiv</button>
                  <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="text-charade-500 px-2 py-1 rounded hover:bg-charade-100 disabled:opacity-50">
                      <FontAwesomeIcon icon={faAngleDoubleRight} />
                  </button>
              </div>
              {showAddVenteDialog && <AddVente onClose={() => setShowAddVenteDialog(false)} updateData={handleUpdateData} />}
              {showEditVenteDialog && (
                  <EditVente
                      onClose={() => setShowEditVenteDialog(false)}
                      updateData={handleUpdateData}
                      venteIndex={editVenteIndex}
                      venteData={data[editVenteIndex]}
                  />
              )}
              {showSuccess && <Success />}
          </div>
      </div>
  );
}  