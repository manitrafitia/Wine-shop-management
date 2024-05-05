import React from 'react';

export default function Intro() {
  return (
    <div className="flex justify-center items-center h-screen  bg-cover bg-center" style={{ backgroundImage: `url('/Wine_Black_background_Bottle_Stemware_512316_1280x923.jpg')` }}>
      <div className="absolute inset-0 z-10 bg-black opacity-75"></div> 
      <div className="text-left font-calistoga z-20 text-white p-20 w-1/2">
        <p className="font-semibold text-gray-50 text-sm py-2">BIENVENUE A VINSPIRATION</p>
        <h2 className='text-3xl text-white pt-2' style={{ fontFamily: 'Quattrocento, Serif', fontWeight: 500 }}>Vinspiration,</h2>
        <h2 className='text-3xl text-white pb-2' style={{ fontFamily: 'Quattrocento, Serif', fontWeight: 500 }}>Chaque bouteille raconte une histoire.</h2>
        <p className='py-2'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
        <button className="mt-4 bg-rose-800 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl">Commencer l'aventure</button>
      </div>
      <div className="w-1/2"></div>
    </div>
  );
}
