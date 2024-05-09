import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faClockRotateLeft, faUser } from '@fortawesome/free-solid-svg-icons';
import Avatar from '../assets/images.png';

export default function Header({ username, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility

  // Function to handle dropdown toggle
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    updateUsername("NouveauNomUtilisateur");
  };

  // Function called when the value of search changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Propagate search value to the search function in the parent component
    onSearch(value);
  };

  return (
    <header className="rounded-xl bg-white m-4">
      <nav className="container mx-auto px-2 py-2 flex items-center justify-between">
        <ul className="flex items-center">
          <li className="relative text-charade-600">
            <input 
              type="search" 
              placeholder="Rechercher" 
              value={searchQuery}
              onChange={handleSearchChange} // Call the function when typing
              className="bg-slate-100 w-300 h-10 px-5 pr-10 rounded text-sm"
            />
            <button 
              type="submit" 
              className="absolute right-0 top-0 mt-2 mr-4"
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </li>
        </ul>
        <ul className="flex items-center">
        <li className="ml-4">
            <FontAwesomeIcon icon={faBell} />
          </li>
          <li className="ml-4 relative p-2 pl-3 rounded-full bg-slate-200 w-10">
            <button 
              id="dropdownInformationButton" 
              onClick={toggleDropdown} 
              type="button"
              className="hover:text-slate-600"
            >
             <FontAwesomeIcon icon={faUser} /> 
             
            </button>
            {isDropdownOpen && (
              <div id="dropdownInformation" className="z-10 absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  <div>Bonnie Green</div>
                  <div className="font-medium truncate">name@flowbite.com</div>
                </div>
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownInformationButton">
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      Profil
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      Appareance
                    </a>
                  </li>
                </ul>
                <div className="py-2">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                    
                  Se déconnecter</a>
                </div>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
