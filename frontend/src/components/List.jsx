import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";

export default function List() {
  const [vins, setVins] = useState([]);

  useEffect(() => {
    async function fetchVins() {
      try {
        const response = await axios.get('http://localhost:3000/vin');
        setVins(response.data);
      } catch (error) {
        console.error('Error fetching vins:', error);
      }
    }

    fetchVins();
  }, []);

  return (
    <>
      <div className="p-7 rounded-2xl bg-white shadow overflow-y-auto max-h-96">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-max rounded-lg bg-vinRouge-500 p-5 text-white">
            <Square3Stack3DIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xl font-bold">Stock de vins disponibles</p>
          </div>
        </div>

        <ul>
          {vins.map((vin, index) => (
            <li key={index} className="p-4 text-slate-500 border-b flex items-center">
              <img src={vin.photo} alt={vin.nom} className="w-10 rounded-full" />
              
              <p className="ml-2">{vin.nom}</p>
              <div className="ml-auto">
                <p className="text-l font-bold">{vin.quantite}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
