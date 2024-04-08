import React from 'react'
import useTableFunctions from './TableFunctions';
import { faEllipsisH, faEye, faPencil, faTrash, faPlus, faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Pagination() {
    const {
        data,
        setData,
        currentPage,
        paginate,
        totalPages,
      } = useTableFunctions();
  return (
    <div>
           {/* Pagination */}
      <nav aria-label="Page navigation example">
        <ul className="flex items-center -space-x-px h-10 text-base float-right mt-2">
          {/* Bouton de page précédente */}
          <li>
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700">
              <FontAwesomeIcon icon={faAngleDoubleLeft} />
            </button>
          </li>

          {/* Affichage des pages */}
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index}>
              <button onClick={() => paginate(index + 1)} className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${currentPage === index + 1 ? 'bg-pink-50 text-pink-600' : ''}`}>
                {index + 1}
              </button>
            </li>
          ))}

          {/* Bouton de page suivante */}
          <li>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700">
              <FontAwesomeIcon icon={faAngleDoubleRight} />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
