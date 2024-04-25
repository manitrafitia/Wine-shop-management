import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 
  { 
    faDownload, faTrash, faPlus, faSort,
    faSortUp, faSortDown, faAngleDoubleLeft, faAngleDoubleRight 
  } from '@fortawesome/free-solid-svg-icons';
import useTableFunctions from './TableFunctions';
import AddProduction from './AddProduction'; 
import EditProduction from './EditProduction';
import ConfirmDelete from './ConfirmDelete'; 
import Success from './Success';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('fr-FR', options).format(date);
  return formattedDate;
};

export default function Production() {
  const [showAddProductionDialog, setShowAddProductionDialog] = useState(false);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedProduction, setSelectedProduction] = useState(null);
  const [productionToDelete, setProductionToDelete] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [sortType, setSortType] = useState('asc');
  const [sortColumn, setSortColumn] = useState('');
  const [itemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectedProductionId, setSelectedProductionId] = useState(null);
  const [showEditProductionDialog, setShowEditProductionDialog] = useState(false);

  const {
    data,
    setData,
  } = useTableFunctions();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vinResponse = await axios.get('http://localhost:3000/vin');
        const vins = vinResponse.data;

        const productionResponse = await axios.get('http://localhost:3000/production');
        const productions = productionResponse.data.map(production => {
          const vin = vins.find(vin => vin._id === production.vin);
          return {
            ...production,
            nom_vin: vin ? vin.nom : ''
          };
        });

        setData(productions);
        setCheckedItems(new Array(productions.length).fill(false));
        setIsCheckedAll(false);
        const totalPagesCount = Math.ceil(productions.length / itemsPerPage);
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

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
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

  const filteredData = sortedData.filter((item) =>
    item.vin.toLowerCase().includes(searchValue.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);



  const handleEditProduction = async (num_prod) => {
    try {
      setSelectedProductionId(num_prod);
      const response = await axios.get(`http://localhost:3000/production/${num_prod}`);
      setSelectedProduction(response.data);
      setShowEditProductionDialog(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des données du production à modifier :', error);
    }
  };

  const handleOpenConfirmDeleteDialog = (production) => {
    setProductionToDelete(production);
    setShowConfirmDeleteDialog(true);
  };

  const handleCloseConfirmDeleteDialog = () => {
    setShowConfirmDeleteDialog(false);
  };

  const handleDeleteProduction = async () => {
    try {
      await axios.delete(`http://localhost:3000/production/${productionToDelete.num_prod}`);
      handleUpdateData();
      setShowConfirmDeleteDialog(false);
      showSuccessMessage();
    } catch (error) {
      console.error('Erreur lors de la suppression du vin :', error);
    }
  };

  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Liste des productions', 10, 10);
    let yPos = 20;
    paginatedData.forEach((item, index) => {
      doc.text(`${index + 1}. Numéro de production: ${item.num_prod}, VIN: ${item.nom_vin}, Quantité: ${item.quantite}, Date: ${formatDate(item.date_prod)}, Région: ${item.region}`, 10, yPos);
      yPos += 10;
    });
    doc.save('productions.pdf');
  };

  return (
    <div className="overflow-x-auto m-4 bg-white rounded-2xl p-4">
  <p className="text-2xl text-charade-700">Liste des productions</p>
  <div className="flex flex-col sm:flex-row justify-between mb-4 mt-4">
    <div className="mb-4 sm:mb-0">
      <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        placeholder="Rechercher..."
        className="w-full sm:w-auto border border-charade-200 rounded-2xl px-4 py-2"
      />
    </div>
    <div className="flex flex-wrap">
      <button className="border border-charade-500 text-charade-500 font-semibold px-4 mr-2 py-2 rounded-xl hover:bg-charade-100" onClick={() => setShowAddProductionDialog(true)}>
        <FontAwesomeIcon className='mr-2' icon={faPlus} />Ajouter
      </button>
      <button className="bg-charade-100 px-4 py-2 rounded-xl font-semibold hover:bg-charade-200" onClick={exportToPDF}>
        <FontAwesomeIcon className='mr-2' icon={faDownload} />Exporter en PDF
      </button>
    </div>
  </div>
  <div className="overflow-x-auto"> {/* Ajout d'une classe overflow-x-auto pour permettre le défilement horizontal sur les petits écrans */}
    <table className="table-auto min-w-full z-3">
        <thead className='text-charade-900 text-left border-t border-charade-100'>
          <tr>
            <th className="px-4 py-4  font-semibold" onClick={() => handleSort('num_prod')}>
              #<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'num_prod' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4  font-semibold" onClick={() => handleSort('vin')}>
              VIN<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'vin' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4  font-semibold" onClick={() => handleSort('quantite')}>
              QUANTITE<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'quantite' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4  font-semibold" onClick={() => handleSort('date_prod')}>
              DATE<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'date_prod' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4  font-semibold" onClick={() => handleSort('region')}>
              REGION<FontAwesomeIcon className="float-right text-charade-200 hover:text-charade-600" icon={sortColumn === 'date_prod' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-4 py-4"></th>
            <th></th>
          </tr>
        </thead>
        <tbody className="text-gray-600 divide-y">
          {paginatedData.map((item, index) => (
            <tr key={index} className='text-black text-sm font-semibold font-semibold'>
              <td className="border-t border-charade-100 px-4 py-4">{item.num_prod}</td>
              <td className="border-t border-charade-100 px-4 py-4">{item.nom_vin}</td>
              <td className="border-t border-charade-100 px-4 py-4">{item.quantite}</td>
              <td className="border-t border-charade-100 px-4 py-4">{formatDate(item.date_prod)}</td>
              <td className="border-t border-charade-100 px-4 py-4">{item.region}</td>
              <td className="border-t border-charade-100  px-4 py-4 text-charade-500 hover:text-charade-900">
                <button onClick={() => handleEditProduction(item.num_prod)}>Modifier</button>
              </td>
              <td className="border-t border-charade-100  px-4 py-4 text-charade-500 hover:text-charade-900">
                <button onClick={() => handleOpenConfirmDeleteDialog(item)}>Supprimer</button>
              </td>
              <td className="border-t border-charade-100  px-4 py-4 text-charade-500 hover:text-charade-900">
                <button><FontAwesomeIcon className="w-10" icon={faDownload} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
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

      {showAddProductionDialog && <AddProduction onClose={() => setShowAddProductionDialog(false)} updateData={handleUpdateData} />}
      {showEditProductionDialog && (
        <EditProduction
          onClose={() => setShowEditProductionDialog(false)}
          updateData={handleUpdateData}
          productionId={selectedProductionId}
          productionData={selectedProduction}
        />
      )}
      {showSuccess && <Success />}
      {showConfirmDeleteDialog && <ConfirmDelete onClose={handleCloseConfirmDeleteDialog} onDelete={handleDeleteProduction} />}
    </div>
  );
}
