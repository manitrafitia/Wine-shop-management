import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faWineBottle, faWineGlass, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default function Cards() {
  const [chiffreAffaires, setChiffreAffaires] = useState(null);
  const [nombreBouteillesVendues, setNombreBouteillesVendues] = useState(null);
  const [totalQuantiteProduite, setTotalQuantiteProduite] = useState(null);
  const [totalClients, setTotalClients] = useState(null);

  useEffect(() => {
      async function fetchData() {
          try {
              const salesResponse = await axios.get('http://localhost:3000/vente/total');
              animateNumber(salesResponse.data.chiffreAffaires, setChiffreAffaires);
              animateNumber(salesResponse.data.nombreBouteillesVendues, setNombreBouteillesVendues);

              const productionResponse = await axios.get('http://localhost:3000/production/total');
              animateNumber(productionResponse.data.totalQuantiteProduite, setTotalQuantiteProduite);

              const clientsResponse = await axios.get('http://localhost:3000/client/total');
              animateNumber(clientsResponse.data.totalClients, setTotalClients);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      }

      fetchData();
  }, []);

  // Fonction pour animer le nombre progressivement
  const animateNumber = (finalValue, setValue) => {
      let currentValue = 0;
      const increment = Math.ceil(finalValue / 50); // Nombre d'incrément pour atteindre la valeur finale

      const interval = setInterval(() => {
          if (currentValue < finalValue) {
              setValue(currentValue);
              currentValue += increment;
          } else {
              setValue(finalValue);
              clearInterval(interval); // Arrêter l'intervalle une fois que la valeur finale est atteinte
          }
      }, 20); // Intervalle de mise à jour (en millisecondes)
  };
  return (
    <div className="flex justify-center">
      <div className="rounded-xl bg-white flex m-4 p-5 shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4">
        <div className="flex justify-between w-full">
          <div>
          <p className="    font-semibold text-slate-500">Chiffres d'affaires</p>
          <p className="text-xl   font-bold">{chiffreAffaires ? `${chiffreAffaires} €` : 'Chargement en cours...'}</p>
          </div>
        </div>
        <div>
          <div className="ml-7 w-10 h-10 text-white rounded-xl bg-gradient-to-r from-wine-700 to-slate-900 shadow-xl">
            <FontAwesomeIcon className='p-3' icon={faCoins} />
          </div>
        </div>
      </div>
      <div className="rounded-xl bg-white flex m-4 p-5 shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4">
      <div className="flex justify-between w-full">
      <div>
        <p className="    font-semibold text-slate-500">Vins vendus</p>
        <div>
        <p className="text-xl   font-bold ">{nombreBouteillesVendues !== null ? nombreBouteillesVendues : 'Chargement en cours...'}</p>
        </div>
      </div>
      <div className="ml-7 w-10 h-10 text-white rounded-xl bg-gradient-to-r from-wine-700 to-slate-900 shadow-xl">
        <FontAwesomeIcon className='p-3' icon={faWineBottle} />
      </div>
    </div>
      </div>
      <div className="rounded-xl bg-white flex m-4 p-5 shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4">
        <div  className="flex justify-between w-full">
          <div>
          <p className="    font-semibold text-slate-500">Vins produits</p>
          <p className="text-xl font-bold">{totalQuantiteProduite !== null ? totalQuantiteProduite : 'Chargement en cours...'}</p>
          </div>
        
        </div>
        <div>
          <div className="ml-7 w-10 h-10 bg-gradient-to-r from-wine-700 to-slate-900 rounded-xl text-white shadow-xl">
            <FontAwesomeIcon className='p-3' icon={faWineGlass} />
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-white flex m-4 p-5 shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4">
        <div  className="flex justify-between w-full">
          <div>
          <p className="    font-semibold text-slate-500">Clients
           inscrits</p>
           <p className="text-xl font-bold">{totalClients !== null ? totalClients : 'Chargement en cours...'}</p>
          </div>     
        </div>
        <div>
          <div className="ml-7 w-10 h-10 bg-gradient-to-r from-wine-700 to-slate-900 rounded-xl text-white shadow-xl">
            <FontAwesomeIcon className='p-3' icon={faUserGroup} />
          </div>
        </div>
      </div>
    </div>
  );
}
