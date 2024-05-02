import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const useTableFunctions = () => {
  const [data, setData] = useState([]);
  const [showDialogIndex, setShowDialogIndex] = useState(-1);
  const [dialogPosition, setDialogPosition] = useState({ top: 0, left: 0 });
  const iconRef = useRef(null);
  const dialogRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState('asc');
  const [sortColumn, setSortColumn] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/production');
        setData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, []);

  const handleEllipsisClick = (index, event) => {
    const iconRect = event.target.getBoundingClientRect();
    setShowDialogIndex(index);
    setDialogPosition({ top: iconRect.bottom, left: iconRect.left - 75 });
  };

  const handleCloseDialog = () => {
    setShowDialogIndex(-1);
  };

  // Gestion de la fermeture de la boîte de dialogue en cliquant à l'extérieur de celle-ci
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setShowDialogIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fonction pour déterminer la couleur en fonction de la quantité
  const getQuantiteColor = (quantite) => {
    return quantite < 10 ? 'text-red-500' : 'text-gray-500';
  };

  const paginate = (pageNumber) => {
    const itemsPerPage = 10;
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const slicedData = sortedData.slice(startIndex, endIndex);

    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setData(slicedData);
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

  const handleUpdateData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/data');
      setData(response.data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données :', error);
    }
  };

  const handleDelete = async (id, endpoint) => {
    try {
      await axios.delete(`http://localhost:3000/${endpoint}/${id}`);
      handleUpdateData();
      showSuccessMessage();
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  };

  const showSuccessMessage = () => {
    // Gestion de l'affichage du message de succès
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

  const totalPages = Math.ceil(data.length / 10);

  // Calcul de la pagination
  const paginatedData = sortedData.slice((currentPage - 1) * 10, currentPage * 10);

  return {
    data,
    setData,
    showDialogIndex,
    setShowDialogIndex,
    dialogPosition,
    setDialogPosition,
    iconRef,
    dialogRef,
    currentPage,
    setCurrentPage,
    sortType,
    setSortType,
    sortColumn,
    setSortColumn,
    handleEllipsisClick,
    handleCloseDialog,
    getQuantiteColor,
    paginate,
    sortedData,
    totalPages,
    handleUpdateData,
    handleDelete,
    paginatedData, // Ajout de la variable paginatedData
  };
};

export default useTableFunctions;
