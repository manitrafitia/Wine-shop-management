import React, { useState } from 'react';
import { faTable, faMartiniGlass, faUserGroup, faStore, faHome, faChartBar } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import Production from './table/Production';
import Client from './table/Client';
import Commande from './table/Commande';
import Rech from '../components/Rech';
import Sidebar, { SidebarItem } from '../components/Sidebar';
import Vin from '../components/table/Vin';
import ProductionReport from '../components/ProductionReport';

function MonApp({}) {
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [username, setUsername] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSidebarItemClick = (page) => {
    setCurrentPage(page);
  };

  const updateUsername = (newUsername) => {
    setUsername(newUsername);
  };
  // Fonction de filtrage des composants en fonction de la recherche
  const filteredComponents = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Vin':
        return <Vin />;
      case 'Production':
        return <Production />;
      case 'Client':
        return <Client />;
      case 'Commande':
        return <Commande />;
      case 'Rech':
        return <Rech />;
      case 'ProductionReport':
        return <ProductionReport />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex text-charade-800 bg-charade-100 dark:bg-charade-900 dark:text-white">
        <Sidebar className="w-64">
          <button onClick={() => handleSidebarItemClick('Dashboard')}>
            <SidebarItem
              icon={faHome}
              text="Dashboard"
              active={currentPage === 'Dashboard'}
            />
          </button>
          <br />
          <button onClick={() => handleSidebarItemClick('Rech')}>
            <SidebarItem
              icon={faChartBar}
              text="Recherche"
              active={currentPage === 'Rech'}
            />
          </button>
          <br />
          <button onClick={() => handleSidebarItemClick('Vin')}>
            <SidebarItem
              icon={faMartiniGlass}
              text="Vins"
              active={currentPage === 'Vin'}
            />
          </button>
          <br />
          <button onClick={() => handleSidebarItemClick('Production')}>
            <SidebarItem
              icon={faTable}
              text="Productions"
              active={currentPage === 'Production'}
            />
          </button>
          <br />
          <button onClick={() => handleSidebarItemClick('Client')}>
            <SidebarItem
              icon={faUserGroup}
              text="Clients"
              active={currentPage === 'Client'}
            />
          </button>
          <br />
          <button onClick={() => handleSidebarItemClick('Commande')}>
            <SidebarItem
              icon={faStore}
              text="Commandes"
              active={currentPage === 'Commande'}
            />
          </button>
          <br />
          <br />
        </Sidebar>
        <div className="flex-1 bg-slate-100 dark:bg-slate-900">
          {/* Affichage du header avec le champ de recherche */}
          <Header username={username} updateUsername={updateUsername} />
          {/* Affichage des composants filtrés */}
          {filteredComponents()}
        </div>
        {username && <Header username={username} />}
      </div>
    </>
  );
}

export default MonApp;
