import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";

export default function Catalogue() {
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
      <div className="p-7 shadow overflow-y-auto max-h-96">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div>
            <p className="text-xl font-bold ">Stock de vins disponibles</p>
          </div>
        </div>

        <ul>
          {vins.map((vin, index) => (
            <div className="fle">
  <li key={index} className="rounded-xl bg-white">
                <div className="flex w-full">
                    <div>
                    <img src={vin.photo}  className="w-10 rounded-full" />
                    </div>
                    <p>
                    {vin.description}
                    </p>
                <div>
                    <p className="text-xl font-semibold text-center">{vin.nom}</p>
                </div>
                </div>
              <p className="ml-2">{vin.nom}</p>
              <div className="ml-auto">
                <p className="text-l font-bold">{vin.quantite}</p>
              </div>
            </li>
            </div>
          
          ))}
        </ul>
      </div>
    </>
  );
}
