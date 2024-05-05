import React, { useState } from 'react';
import axios from 'axios'; 
import Login from './Login';

export default function SignUp({ onSignUp }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/user/register', {
        username: username,
        password: password
      });

      if (response.status === 201) {
        onSignUp(); 
        setShowLogin(true);
      } else {
        console.error('Erreur lors de la création de l\'utilisateur');
      }
    } catch (error) {
      console.error('Une erreur s\'est produite lors de la création de l\'utilisateur:', error);
    }
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  if (showLogin) {
    return <Login />;
  }

  return (
    <div className="relative flex h-screen justify-center items-center bg-slate-100">
      {/* <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url('/3b964f6737d44dfaca1b321106faf203.jpg')` }}></div>
      <div className="absolute inset-0 z-10 bg-black opacity-75"></div> */}
   <div className="z-20 w-1/2 p-7 text-white flex justify-center items-center flex-col bg-white h-screen">
        <img src="2007.i039.019_cyber_security_spyware_data_protection_isometric_set-06.jpg" alt="" />
        {/* <img src="logo.png" alt="" className='w-40 mb-4'/>
        <p className="text-3xl text-black">Vinspiration, Chaque bouteille raconte une histoire.</p> */}
      </div>
      <div  className="z-20 w-1/2">
        <div className='bg-white rounded-xl m-4 p-20 '>
          <h1 className='text-charade-800 font-semibold text-xl'>Inscrivez-vous pour gérer les Commandes et productions de Vinspiration</h1>
          <form onSubmit={handleSubmit} className="flex flex-col font-semibold mt-7 text-charade-800">
            <label htmlFor="username">Nom d'utilisateur ou adresse e-mail</label>
            <input
              className='w-full  p-2 my-4 border border-charade-200 rounded-lg'
              placeholder="xxxxyyyy@xxx.yy"
              type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          
            <label htmlFor="password">Mot de passe</label>
            <input
              className='w-full  p-2 my-4 border border-charade-200 rounded-lg'
              placeholder='********'
              type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
               <label htmlFor="password">Confirmer le mot de passe</label>
            <input
              className='w-full  p-2 my-4 border border-charade-200 rounded-lg'
              placeholder='********'
              type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" className='p-3 rounded-xl text-white bg-blue-800 hover:bg-blue-900'>S'inscrire</button>
            <div className="border border-t my-4"></div>
            <button type="button" onClick={handleLoginClick} className='p-3 rounded-xl bg-white border border-charade-200 hover:bg-charade-100'>Vous avez déjà un compte ?</button>
          </form>
        </div>       
      </div>
    </div>
  );
}