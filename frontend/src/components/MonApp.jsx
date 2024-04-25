import React, { useState } from 'react';
import { faTable, faMartiniGlass, faUserGroup, faStore, faHome, faChartBar } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import Production from '../components/Production';
import Client from '../components/Client';
import Vente from '../components/Vente';
import Rech from '../components/Rech';
import Sidebar, { SidebarItem } from '../components/Sidebar';
import Vin from '../components/Vin';
import ProductionReport from '../components/ProductionReport';


function MonApp({}) {
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [username, setUsername] = useState('');

  const handleSidebarItemClick = (page) => {
    setCurrentPage(page);
  };

  const updateUsername = (newUsername) => {
    setUsername(newUsername);
  };

  return (
    <>
      <div className="flex text-charade-800  bg-charade-100">
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
          <button onClick={() => handleSidebarItemClick('Vente')}>
            <SidebarItem
              icon={faStore}
              text="Ventes"
              active={currentPage === 'Vente'}
            />
          </button>
          <br />
          <br />

        </Sidebar>
        <div className="flex-1 bg-charade-100">
          <Header />
          {currentPage === 'Dashboard' && <Dashboard />}
          {currentPage === 'Vin' && <Vin />}
          {currentPage === 'Production' && <Production />}
          {currentPage === 'Client' && <Client />}
          {currentPage === 'Vente' && <Vente />}
          {currentPage === 'Rech' && <Rech />}
          {currentPage === 'ProductionReport' && <ProductionReport />}
        </div>
        {username && <Header username={username} />}
      </div>

    </>
  );
}

export default MonApp;
