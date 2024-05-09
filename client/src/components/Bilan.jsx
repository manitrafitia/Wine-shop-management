import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function () {
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
    <div className='px-10'>
        <div></div>
        <div className='p-4 '>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <div className='p-7 '>
          <p className='text-xl pb-2 font-semibold'>Chiffre d'affaires</p>
          <p className="text-xl   font-bold">{chiffreAffaires ? `${chiffreAffaires} €` : 'Chargement en cours...'}</p>
        </div>
        <div className='p-7 '>
          <p className='text-xl pb-2 font-semibold'>Vins vendus</p>
          <p className="text-xl   font-bold ">{nombreBouteillesVendues !== null ? nombreBouteillesVendues : 'Chargement en cours...'}</p>
        </div>
        <div className='p-7 '>
          <p className='text-xl pb-2 font-semibold'>Vins produits</p>
          <p className="text-xl font-bold">{totalQuantiteProduite !== null ? totalQuantiteProduite : 'Chargement en cours...'}</p>
        </div>
        <div className='p-7 '>
          <p className='text-xl pb-2 font-semibold'>Clients inscrits</p>
          <p className="text-xl font-bold">{totalClients !== null ? totalClients : 'Chargement en cours...'}</p>
        </div>
      </div>
    </div>
    </div>
  )
}
