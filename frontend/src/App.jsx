import React, { useState } from 'react';
import './App.css';
import Sidebar, { SidebarItem } from './components/Sidebar';
import Vin from './components/Vin'; // Importez le composant Vin
import { faTable, faMartiniGlass, faUserGroup, faStore, faHome, faChartBar } from '@fortawesome/free-solid-svg-icons';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Production from './components/Production';
import Client from './components/Client';
import Vente from './components/Vente';
import GraphMain from './components/GraphMain'

function App() {
  const [currentPage, setCurrentPage] = useState('Dashboard');

  const handleSidebarItemClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="flex text-slate-800">
        <Sidebar className="w-64">
          <button onClick={() => handleSidebarItemClick('Dashboard')}>
            <SidebarItem
              icon={faHome}
              text="Dashboard"
              active={currentPage === 'Dashboard'}
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
          <button onClick={() => handleSidebarItemClick('GraphMain')}>
            <SidebarItem
              icon={faChartBar}
              text="Graphiques"
              active={currentPage === 'GraphMain'}
            />
          </button>
        </Sidebar>
        <div className="flex-1 bg-slate-100">
          <Header />
          {currentPage === 'Dashboard' && <Dashboard />}
          {currentPage === 'Vin' && <Vin />}
          {currentPage === 'Production' && <Production />}
          {currentPage === 'Client' && <Client />}
          {currentPage === 'Vente' && <Vente />}
          {currentPage === 'GraphMain' && <GraphMain />}
        </div>
        
      </div>
     
    </>
  );
}

export default App;
