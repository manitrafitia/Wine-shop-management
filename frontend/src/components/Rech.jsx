import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NotFound from './NotFound'; // Importer le composant NotFound

export default function Rech() {
  const [showDetails, setShowDetails] = useState(false);
  const [vins, setVins] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [firstPriceValue, setFirstPriceValue] = useState('');
  const [secondPriceValue, setSecondPriceValue] = useState('');
  const [firstAlcoholValue, setFirstAlcoholValue] = useState('');
  const [secondAlcoholValue, setSecondAlcoholValue] = useState('');
  const [loading, setLoading] = useState(true); // État pour indiquer le chargement des données

  useEffect(() => {
    fetchAllVins();
  }, []);

  const fetchAllVins = async () => {
    try {
      const response = await axios.get('http://localhost:3000/vin');
      setVins(response.data);
      setLoading(false); // Mettre le chargement à false une fois les données chargées
    } catch (error) {
      console.error(error);
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleFirstPriceChange = (e) => {
    const selectedValue = parseInt(e.target.value);
    setFirstPriceValue(selectedValue);
    if (parseInt(secondPriceValue) < selectedValue) {
      setSecondPriceValue('');
    }
  };

  const handleSecondPriceChange = (e) => {
    setSecondPriceValue(parseInt(e.target.value));
  };

  const handleFirstAlcoholChange = (e) => {
    const selectedValue = parseInt(e.target.value);
    setFirstAlcoholValue(selectedValue);
    if (parseInt(secondAlcoholValue) < selectedValue) {
      setSecondAlcoholValue('');
    }
  };

  const handleSecondAlcoholChange = (e) => {
    setSecondAlcoholValue(parseInt(e.target.value));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/vin/search', {
        type: selectedType,
        prixMin: firstPriceValue,
        prixMax: secondPriceValue,
        teneurAlcoolMin: firstAlcoholValue,
        teneurAlcoolMax: secondAlcoholValue
      });
      setVins(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <>
      <div className="rounded-xl bg-white p-7 m-4   flex justify-center items-center">
        <form action="" onSubmit={handleSearch}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className='md:ml-2'>
              <label htmlFor="">Type</label>
              <select
                className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">type</option>
                <option value="1">Vin rouge</option>
                <option value="2">Vin blanc</option>
                <option value="3">Vin rosé</option>
              </select>
            </div>
            <div>
              <label htmlFor="">Prix</label>
              <div className='md:ml-2 flex'>
                <div>
                  <select
                    className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
                    value={firstPriceValue}
                    onChange={handleFirstPriceChange}
                  >
                    <option value="">prix en ($)</option>
                    <option value="10">10</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
                <span>
                  <select
                    className={`w-full p-2 mt-2 mb-3 ml-2 order border-charade-200 rounded-lg ${parseInt(secondPriceValue) < firstPriceValue ? 'bg-red-200 border border-red-500 text-red-500 font-semibold' : ''}`}
                    value={secondPriceValue}
                    onChange={handleSecondPriceChange}
                    disabled={parseInt(secondPriceValue) < firstPriceValue}
                  >
                    <option value="">prix en ($)</option>
                    <option value="100">100</option>
                    <option value="500">500</option>
                    <option value="1000">1000</option>
                  </select>
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="">Teneur</label>
              <div className='md:ml-2 flex'>
                <div>
                  <select
                    className='w-full p-2 mt-2 mb-3 border border-charade-200 rounded-lg'
                    value={firstAlcoholValue}
                    onChange={handleFirstAlcoholChange}
                  >
                    <option value="">teneur en (%)</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                </div>
                <span>
                  <select
                    className={`w-full p-2 mt-2 mb-3 ml-2 order border-charade-200 rounded-lg ${parseInt(secondAlcoholValue) < firstAlcoholValue ? 'bg-red-200 border border-red-500 text-red-500 font-semibold' : ''}`}
                    value={secondAlcoholValue}
                    onChange={handleSecondAlcoholChange}
                    disabled={parseInt(secondAlcoholValue) < firstAlcoholValue}
                  >
                    <option value="">teneur en (%)</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                </span>
              </div>
            </div>
          </div>
          <div className="text-right mt-4">
            <button className="bg-charade-800 text-white px-4 py-2 rounded-lg">Rechercher</button>
          </div>
        </form>
      </div>
      <div className="m-4">
        {/* Si la liste des vins est vide et le chargement est terminé, afficher NotFound */}
        {vins.length === 0 && !loading ? <NotFound /> : (
          vins.map(vin => (
            <div key={vin.id} className="rounded-xl bg-white p-4 mb-2 flex">
              <div className="flex-none p-4 mr-4 rounded-xl bg-charade-100 w-52 h-52 flex justify-center items-center">
                <img src={vin.photo} alt={vin.nom} className="h-full" />
              </div>
              <div className='flex-grow p-4'>
                <div>
                  <p className='text-xl font-semibold'>{vin.nom}</p>
                  <p className='text-charade-400 mt-2 mb-3'>{vin.num_vin}</p>
                  <p className="text-gray-600">{vin.description}</p>
                  <div className={`overflow-hidden transition-height duration-500 ease-in-out ${showDetails ? 'h-auto' : 'h-0'}`}>
                    <p className="text-gray-600"></p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
