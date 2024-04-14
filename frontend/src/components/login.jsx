import React, { useState } from 'react';
import axios from 'axios'; // Importez Axios pour effectuer des requêtes HTTP

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Fonction pour gérer la soumission du formulaire de connexion
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envoie des données de connexion au serveur
      const response = await axios.post('http://localhost:3000/user/login', {
        username: username,
        password: password
      });

      // Vérification de la réponse du serveur
      if (response.status === 200) {
        // Si l'authentification réussit, appelez la fonction onLogin pour informer l'application
        onLogin();
      } else {
        console.error('Erreur lors de l\'authentification');
      }
    } catch (error) {
      console.error('Une erreur s\'est produite lors de l\'authentification:', error);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Nom d'utilisateur</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <br />
          <label htmlFor="password">Mot de passe</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <br />
          <button type="submit">Se connecter</button>
        </form>
        <div>Pas de compte? Inscrivez-vous</div>
      </div>
    </>
  );
}
