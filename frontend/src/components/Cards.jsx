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
              const salesResponse = await axios.get('http://localhost:3000/Commande/total');
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
      const increment = Math.ceil(finalValue / 50);

      const interval = setInterval(() => {
          if (currentValue < finalValue) {
              setValue(currentValue);
              currentValue += increment;
          } else {
              setValue(finalValue);
              clearInterval(interval); 
          }
      }, 20); 
  };

  return (
    <div className="flex justify-center m-4">
      <div className="rounded-xl bg-white flex m-1 p-5   w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 dark:bg-black">
        <div className="flex justify-between w-full">
          <div>
          <p className="    font-semibold text-charade-500">Chiffre d'affaires</p>
          <p className="text-xl   font-bold">{chiffreAffaires ? `${chiffreAffaires} €` : 'Chargement en cours...'}</p>
          </div>
        </div>
        <div>
          <div className="ml-7 w-10 h-10 text-blue-500  rounded-full bg-blue-100 dark:text-black">
            <FontAwesomeIcon className='p-3' icon={faCoins} />
          </div>
        </div>
      </div>
      <div className="rounded-xl bg-white flex m-1 p-5   w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 dark:bg-black">
      <div className="flex justify-between w-full">
      <div>
        <p className="    font-semibold text-charade-500">Vins vendus</p>
        <div>
        <p className="text-xl   font-bold ">{nombreBouteillesVendues !== null ? nombreBouteillesVendues : 'Chargement en cours...'}</p>
        </div>
      </div>
      <div className="ml-7 w-10 h-10 text-red-500 rounded-full bg-red-100 dark:text-black">
        <FontAwesomeIcon className='p-3' icon={faWineBottle} />
      </div>
    </div>
      </div>
      <div className="rounded-xl bg-white flex m-1 p-5   w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 dark:bg-black">
        <div  className="flex justify-between w-full">
          <div>
          <p className="    font-semibold text-charade-500">Vins produits</p>
          <p className="text-xl font-bold">{totalQuantiteProduite !== null ? totalQuantiteProduite : 'Chargement en cours...'}</p>
          </div>
        
        </div>
        <div>
          <div className="ml-7 w-10 h-10 bg-green-100  rounded-full text-green-500  dark:text-black">
            <FontAwesomeIcon className='p-3' icon={faWineGlass} />
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-white flex m-1 p-5   w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 dark:bg-black">
        <div  className="flex justify-between w-full">
          <div>
          <p className="    font-semibold text-charade-500">Clients
           inscrits</p>
           <p className="text-xl font-bold">{totalClients !== null ? totalClients : 'Chargement en cours...'}</p>
          </div>     
        </div>
        <div>
          <div className="ml-7 w-10 h-10 bg-yellow-100  rounded-full text-yellow-500 dark:text-black">
            <FontAwesomeIcon className='p-3' icon={faUserGroup} />
          </div>
        </div>
      </div>
    </div>
  );
}
