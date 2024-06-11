import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faPencil, faDownload, faTrash, faPlus, faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import useTableFunctions from '../TableFunctions';
import AddProduction from './Add/AddProduction'; 
import EditProduction from './Edit/EditProduction';
import ConfirmDelete from '../ConfirmDelete'; 
import Success from '../Success'
// Fonction pour formater la date en "DD MMMM YYYY"
const formatDate = (dateString) => {
  // Créez un objet Date à partir de la chaîne de caractères de la date
  const date = new Date(dateString);

  // Options de formatage pour afficher le jour en chiffre, le mois en long et l'année en chiffre
  const options = { day: '2-digit', month: 'long', year: 'numeric' };

  // Utilisez l'objet Intl.DateTimeFormat pour formater la date
  const formattedDate = new Intl.DateTimeFormat('fr-FR', options).format(date);

  return formattedDate;
};

export default function Production() {
  const [searchValue, setSearchValue] = useState(''); // 1. Ajoutez un état pour stocker la valeur de recherche.
  const [selectedProduction, setSelectedProduction] = useState(null);
  const [productionToDelete, setProductionToDelete] = useState(null);
  const handleDeleteProduction = async () => {
    try {
      await axios.delete(`http://localhost:3000/production/${productionToDelete.num_prod}`);
      handleUpdateData(); // Mettre à jour les données après la suppression
      setShowConfirmDeleteDialog(false); 
      showSuccessMessage(); // Fermer la boîte de dialogue de confirmation
    } catch (error) {
      console.error('Erreur lors de la suppression du vin :', error);
    }
  };
  const [showSuccess, setShowSuccess] = useState(false); // État pour contrôler l'affichage du composant Success

  // Fonction pour afficher le composant Success
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
  const [totalPages, setTotalPages] = useState(0);
  const [sortType, setSortType] = useState('asc');
  const [sortColumn, setSortColumn] = useState('');
  const [itemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);

  const [vinList, setWineList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer la liste complète des vins
        const vinResponse = await axios.get('http://localhost:3000/vin');
        const vins = vinResponse.data;
        console.log('Vins:', vins);
  
        // Récupérer les données de production
        const productionResponse = await axios.get('http://localhost:3000/production');
        const productions = productionResponse.data.map(production => {
          // Trouver le nom du vin correspondant à partir de l'ID du vin
          const vin = vins.find(vin => vin._id === production.vin); // Modifier 'id' en '_id'
          return {
            ...production,
            nom_vin: vin ? vin.nom : '' // Si le vin correspondant est trouvé, utiliser son nom, sinon une chaîne vide
          };
        });
        console.log('Productions:', productions);
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
      showSuccessMessage();
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

  const filteredData = sortedData.filter((item) =>
    item.vin.toLowerCase().includes(searchValue.toLowerCase()) // 2. Filtrer les données en fonction de la valeur de recherche.
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const [selectedProductionId, setSelectedProductionId] = useState(null);
  const [showEditProductionDialog, setShowEditProductionDialog] = useState(false);
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

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const handleOpenConfirmDeleteDialog = (production) => {
    setProductionToDelete(production);
    setShowConfirmDeleteDialog(true);
  };
  
  
  const handleCloseConfirmDeleteDialog = () => {
    setShowConfirmDeleteDialog(false);
  };
  

  return (
    <div className="">
         <div className='overflow-x-auto m-4 bg-white rounded-2xl p-4'>
      <span className='text-slate-400 text-sm'>Dashboard \ </span>
          <span className='text-sm font-bold text-slate-400'>Productions </span>
         <p className="text-2xl text-slate-700 pt-2">Liste des productions</p>
      <div className="flex justify-between mb-4 mt-4">
        <div>
        <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        placeholder="Rechercher..."
        className="w-auto border border-slate-200 rounded-xl px-4 py-1"
      />
        </div>
        <div>
          <button className="border border-charade-500 text-charade-500 font-semibold px-2 mr-2 py-1 rounded-xl hover:bg-charade-100" onClick={() => setShowAddProductionDialog(true)}> <FontAwesomeIcon className='mr-2' icon={faPlus} />Ajouter</button>
          {/* <button className="bg-slate-100 px-4 py-2 rounded-xl font-semibold hover:bg-slate-200"> <FontAwesomeIcon className='mr-2' icon={faTrash} />Supprimer</button> */}
        </div>
      </div>
      </div>
      <div className='overflow-x-auto m-4 bg-white rounded-2xl p-4'>
      <table className="table-auto min-w-full z-3">
        <thead className='text-slate-900 text-left border-slate-100'>
          <tr>
            {/* <th className="px-2 py-2">
              <input id="header-checkbox" type="checkbox" checked={isCheckedAll} onChange={handleCheckAll} className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600" />
            </th> */}
            <th className="px-2 py-2  font-semibold" onClick={() => handleSort('num_prod')}>
              #<FontAwesomeIcon className="float-right text-slate-200 hover:text-slate-600" icon={sortColumn === 'num_prod' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            
            <th className="px-2 py-2  font-semibold" onClick={() => handleSort('vin')}>
              VIN<FontAwesomeIcon className="float-right text-slate-200 hover:text-slate-600" icon={sortColumn === 'vin' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-2 py-2  font-semibold" onClick={() => handleSort('quantite')}>
              QUANTITE<FontAwesomeIcon className="float-right text-slate-200 hover:text-slate-600" icon={sortColumn === 'quantite' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-2 py-2  font-semibold" onClick={() => handleSort('date_prod')}>
              DATE<FontAwesomeIcon className="float-right text-slate-200 hover:text-slate-600" icon={sortColumn === 'date_prod' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            <th className="px-2 py-2  font-semibold" onClick={() => handleSort('region')}>
              REGION<FontAwesomeIcon className="float-right text-slate-200 hover:text-slate-600" icon={sortColumn === 'date_prod' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th>
            {/* <th className="px-2 py-2  font-semibold" onClick={() => handleSort('region')}>
              STATUT<FontAwesomeIcon className="float-right text-slate-200 hover:text-slate-600" icon={sortColumn === 'date_prod' ? (sortType === 'asc' ? faSortUp : faSortDown) : faSort} />
            </th> */}
            <th className="px-2 py-2"></th>
            <th></th>
          </tr>
        </thead>
        <tbody className="text-gray-600 divide-y">
          {paginatedData.map((item, index) => (
            <tr key={index}>
              {/* <td className="border-t border-slate-100 px-2 py-2">
                <input id={`checkbox-${index}`} type="checkbox" checked={checkedItems[index]} onChange={() => handleCheckItem(index)} className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600" />
              </td> */}
              <td className="border-t border-slate-100 px-2 py-2">{item.num_prod}</td>
             
              <td className="border-t border-slate-100 px-2 py-2">{item.nom_vin}</td>

              <td className="border-t border-slate-100 px-2 py-2">{item.quantite}</td>
              <td className="border-t border-slate-100 px-2 py-2">{formatDate(item.date_prod)}</td>
              <td className="border-t border-slate-100 px-2 py-2">{item.region}</td>
              {/* <td className="border-t border-slate-100 px-2 py-2 ">
                <div className={
                  item.statut === 1 ? "bg-gray-200 w-20 rounded-xl text-sm text-center font-semibold" :
                  item.statut === 2 ? "bg-orange-500 w-20 rounded-xl text-white text-sm text-center font-semibold" :
                  item.statut === 3 ? "bg-green-500 w-20 rounded-xl text-white text-sm text-center font-semibold" :
                  ""
                }>
                  {item.statut === 1 && "En attente"}
                  {item.statut === 2 && "En cours"}
                  {item.statut === 3 && "Produit"}
                </div>               
              </td> */}
              <td className="border-t border-slate-100  px-2 py-2 text-slate-500 hover:text-slate-900">
                <button onClick={() => handleEditProduction(item.num_prod)}>
                Modifier
                </button>
              </td>
              <td className="border-t border-slate-100  px-2 py-2 text-slate-500 hover:text-slate-900">
              <button onClick={() => handleOpenConfirmDeleteDialog(item)}>Supprimer</button>

</td>
{/* <td className="border-t border-slate-100  px-2 py-2 text-slate-500 hover:text-slate-900">

<button><FontAwesomeIcon className="w-10" icon={faDownload} /></button>
</td> */}
    
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
       {showSuccess && <Success />}
{showConfirmDeleteDialog && <ConfirmDelete onClose={handleCloseConfirmDeleteDialog} onDelete={handleDeleteProduction} />}
   
     
      </div>
</div>

    
  );
}