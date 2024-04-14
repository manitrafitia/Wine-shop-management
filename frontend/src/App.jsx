import React, { useState } from 'react';
import './App.css';
import Login from './components/Login'; // Importez le composant Login
import MonApp from './components/MonApp'; // Importez le composant MonApp

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fonction pour gérer la connexion de l'utilisateur
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <>
      {/* Affichez la page de connexion si l'utilisateur n'est pas connecté */}
      {!isLoggedIn && <Login onLogin={handleLogin} />}
      {/* Affichez l'application principale si l'utilisateur est connecté */}
      {isLoggedIn && <MonApp />}
    </>
  );
}

export default App;
