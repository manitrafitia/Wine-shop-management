import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const useTableFunctions = () => {
  const [data, setData] = useState([]);
  const [showDialogIndex, setShowDialogIndex] = useState(-1);
  const [dialogPosition, setDialogPosition] = useState({ top: 0, left: 0 });
  const iconRef = useRef(null);
  const dialogRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState('asc'); // 'asc' pour croissant, 'desc' pour décroissant
  const [sortColumn, setSortColumn] = useState(''); // Colonne par défaut pour le tri

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/data');
        setData(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, []);
  const handleDelete = async (index) => {
    try {
      const response = await axios.delete(`http://localhost:3000/vin/${data[index].id}`);
      if (response.status === 200) {
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'élément :', error);
    }
  };
  const handleEllipsisClick = (index, event) => {
    const iconRect = event.target.getBoundingClientRect();
    setShowDialogIndex(index);
    setDialogPosition({ top: iconRect.bottom, left: iconRect.left - 75 }); // Ajustement de 50px vers la gauche
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
    if (quantite < 10) {
      return 'text-red-500';
    } else {
      return 'text-gray-500';
    }
  };

  const paginate = (pageNumber) => {
    const itemsPerPage = 7;
    const startIndex = (pageNumber - 1) * itemsPerPage; // Indice de début des éléments pour la page actuelle
    const endIndex = startIndex + itemsPerPage; // Indice de fin des éléments pour la page actuelle
    const slicedData = sortedData.slice(startIndex, endIndex); // Extraire les éléments à afficher pour la page actuelle
  
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setData(slicedData); // Mettre à jour les données à afficher avec les éléments pour la page actuelle
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
    totalPages: Math.ceil(data.length / 10), // Calcul du total des pages
  };
};

export default useTableFunctions;
