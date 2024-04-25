import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import MonApp from './components/MonApp';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      {!isLoggedIn && <Login onLogin={handleLogin} />}
      {isLoggedIn && <MonApp onLogout={handleLogout} />}
    </>
  );
}

export default App;
