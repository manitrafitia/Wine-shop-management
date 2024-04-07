import { useState } from 'react'
import './App.css'
import Sidebar, { SidebarItem } from './components/Sidebar';
import Vin from './components/Vin';
import {faTable, faMartiniGlass, faUserGroup, faStore, faHome}from '@fortawesome/free-solid-svg-icons';
import Header from './components/Header'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="flex text-slate-800">
    <Sidebar className="w-64">
      <SidebarItem 
        icon={faHome}
        text="Home"
        active
        />
        <SidebarItem 
        icon={faTable}
        text="Productions"
        />
         <SidebarItem 
        icon={faMartiniGlass}
        text="Vins"
        />
        <SidebarItem 
        icon={faUserGroup}
        text="Clients"
        />
        <SidebarItem 
        icon={faStore}
        text="Ventes"
        />      
      </Sidebar>
      <div className="flex-1 bg-slate-100">
        <Header></Header>
       <Vin></Vin>
      </div>
    </div>
      
    </>
  )
}

export default App
