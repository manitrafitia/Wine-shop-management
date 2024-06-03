import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faPencil, faTrash, faPlus, faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import useTableFunctions from '../TableFunctions';
import AddVente from './Add/AddVente';
import EditVente from './Edit/EditVente'; // Importez le composant EditVente

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
  const [totalPages, setTotalPages] = useState(0);

  const {
    data,
    setData,
    setShowDialogIndex,
    setDialogPosition,
  } = useTableFunctions();

  const [showAddVenteDialog, setShowAddVenteDialog] = useState(false);
  const [showEditVenteDialog, setShowEditVenteDialog] = useState(false); // Ajoutez un nouvel état pour le composant EditVente
  const [editVenteIndex, setEditVenteIndex] = useState(null); // Ajoutez un nouvel état pour stocker l'index de la vente à modifier

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
        setVinNames(vinNamesMap);
        setCheckedItems(new Array(venteResponse.data.length).fill(false));
        setIsCheckedAll(false);
        const totalPagesCount = Math.ceil(venteResponse.data.length / itemsPerPage);
        setTotalPages(totalPagesCount);
        console.log('Ventes data:', venteResponse.data); // Debug: Vérifiez les données de vente
        console.log('Vins data:', vinResponse.data); // Debug: Vérifiez les données de vin
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
        <td className="border-t border-gray-200 px-4 py-4">
          {vente.vins && vente.vins.length > 0 ? (
            vente.vins.map(vinItem => {
              const vinName = vinNames[vinItem.vin] || 'Chargement...';
              return (
                <div key={vinItem.vin}>
                  {vinName} (Quantité: {vinItem.quantite})
                </div>
              );
            })
            
          ) : (
            <div>Aucun vin associé</div>
          )}
        </td>
        <td className="border-t border-gray-200 px-4 py-4">{formatDate(vente.date)}</td>
        <td className="border-t border-gray-200 px-4 py-4">{vente.mode_paiement}</td>
        <td className="border-t border-gray-200 px-4 py-4">{vente.montant_total}</td>
        <td>
          <button onClick={() => {
            setShowEditVenteDialog(true);
            setEditVenteIndex(index);
          }}>
            Modifier
          </button>
        </td>
        <td>Télécharger</td>
      </tr>
    ));

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
              <th className="px-4 py-4 font-semibold" onClick={() => handleSort('date')}>
                DATE<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'date' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
              </th>
              <th className="px-4 py-4 font-semibold" onClick={() => handleSort('mode_paiement')}>
                MODE DE PAIEMENT<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'mode_paiement' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
              </th>
              <th className="px-4 py-4 font-semibold" onClick={() => handleSort('montant_total')}>
                MONTANT TOTAL<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'montant_total' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody className='align-baseline'>
            {sortedVentes}
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

      </div>
      {showAddVenteDialog && <AddVente onClose={() => setShowAddVenteDialog(false)} onSave={handleUpdateData} />}
      {showEditVenteDialog && editVenteIndex !== null && (
        <EditVente
onClose={() => setShowEditVenteDialog(false)}
vente={data[editVenteIndex]} // Passer les données de la vente à modifier
onUpdate={handleUpdateData} // Passer la fonction de mise à jour des données
/>
)}
</div>
);
}
