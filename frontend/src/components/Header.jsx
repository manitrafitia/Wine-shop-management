import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell } from '@fortawesome/free-solid-svg-icons';
import Avatar from '../assets/images.png';

export default function NavigationBar() {
  return (
    <header className="w-full">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <ul className="flex items-center">
        <li className="relative text-slate-600">
            <input 
              type="search" 
              placeholder="Search" 
              className="bg-white w-300 h-10 px-5 pr-10 rounded text-sm"
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
          <li className="ml-4">
          <img
            src={ Avatar }
            alt=""
            className="w-8 h-8 rounded-full"
          />
          </li>
        </ul>
      </nav>
    </header>
  );
}
