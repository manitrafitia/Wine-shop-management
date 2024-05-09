import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Panier from './Panier';

export default function ListeVin() {
    const [vins, setVins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [panier, setPanier] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [firstPriceValue, setFirstPriceValue] = useState('');
    const [secondPriceValue, setSecondPriceValue] = useState('');
    const [firstAlcoholValue, setFirstAlcoholValue] = useState('');
    const [secondAlcoholValue, setSecondAlcoholValue] = useState('');

    useEffect(() => {
        fetchAllVins();
    }, []);

    const fetchAllVins = async () => {
        try {
            const response = await axios.get('http://localhost:3000/vin');
            setVins(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
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

    const addToCart = async (vin) => {
        try {
            const response = await axios.post('http://localhost:3000/commande/panier/add', {
                vinId: vin._id,
                quantity: 1 // Vous pouvez définir la quantité par défaut ici
            });
            setPanier(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromCart = async (vinId) => {
        try {
            const response = await axios.delete(`http://localhost:3000/panier/${vinId}`);
            setPanier(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const updateQuantity = async (vinId, newQuantity) => {
        try {
            const response = await axios.put(`http://localhost:3000/panier/${vinId}`, {
                quantity: newQuantity
            });
            setPanier(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div className="rounded-xl bg-white p-7 m-20 mb-0 flex justify-center items-center">
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
                                        <option value="100">100</option>
                                        <option value="500">500</option>
                                        <option value="1500">1000</option>
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
                        <button className="bg-blue-800 text-white px-4 py-2 rounded-lg">Rechercher</button>
                    </div>
                </form>
            </div>
            <Panier panier={panier} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />
            <div className="flex flex-wrap justify-center 3/4">
                {vins.map(vin => (
                    <div key={vin._id} className="relative m-10 flex w-full max-w-xs flex-col overflow-hidden rounded bg-white">
                        <a className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-2xl bg-white justify-center" href="#">
                            <img className="object-cover" src={vin.photo} alt="product image" />
                        </a>
                        <div className="mt-4 px-5 pb-5">
                            <a href="#">
                                <h5 className="text-xl tracking-tight text-slate-900">{vin.nom}</h5>
                            </a>
                            <div className="mt-2 mb-5 flex items-center justify-between">
                                <p>
                                    <span className="text-3xl font-bold text-slate-900">{vin.prix} €</span>
                                </p>
                                <div className="flex items-center">
                                    <p>étoiles icones</p>
                                    <span className="mr-2 ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">5.0</span>
                                </div>
                            </div>
                            <button onClick={() => addToCart(vin)} className="flex items-center justify-center rounded-md bg-rose-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
                                Ajouter à la carte
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
