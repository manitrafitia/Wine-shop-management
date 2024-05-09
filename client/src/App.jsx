import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar'
import ListeVin from './components/ListeVin'; 
import Accueil
 from './components/Accueil';
function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div className="dark:bg-black bg-slate-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/listeVin" element={<ListeVin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
