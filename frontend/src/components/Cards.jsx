import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faWineBottle, faWineGlass, faUserGroup } from '@fortawesome/free-solid-svg-icons';

export default function Cards() {
  return (
    <div className="flex justify-center">
      <div className="rounded-2xl bg-vinRouge-500 flex m-4 p-5 shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4">
        <div>
          <p className="text-lg font-semibold text-slate-100">Chiffre d'affaire</p>
          <div>
            <p className="text-xl pb-4 font-bold text-slate-100">20038 $</p>
          </div>
          <div className='text-lg text-white'>
            <span className="text-green-200 font-bold"> +20% </span>
            depuis hier
          </div>
        </div>
        <div>
          <div className="ml-7 w-10 h-10 bg-white rounded-full text-vinRouge-500">
            <FontAwesomeIcon className='p-3' icon={faCoins} />
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-white flex m-4 p-5 shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4">
        <div>
          <p className="text-lg font-semibold text-slate-500">Bouteilles vendues</p>
          <div>
            <p className="text-xl pb-4 font-bold text-slate-500">1273</p>
          </div>
          <div className='text-lg'>
            <span className="text-red-500 font-bold"> -3% </span>
            depuis hier
          </div>
        </div>
        <div>
          <div className="ml-7 w-10 h-10 text-white rounded-full bg-frenchRose-500">
            <FontAwesomeIcon className='p-3' icon={faWineBottle} />
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-vinRouge-500 flex m-4 p-5 shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4">
        <div>
          <p className="text-lg font-semibold text-slate-100">bouteilles produites</p>
          <div>
            <p className="text-xl pb-4 font-bold text-slate-100">2007</p>
          </div>
          <div className='text-lg text-white'>
            <span className="text-red-200 font-bold"> -3% </span>
            depuis hier
          </div>
        </div>
        <div>
          <div className="ml-7 w-10 h-10 text-white rounded-full bg-vinRouge-500">
            <FontAwesomeIcon className='p-3' icon={faWineGlass} />
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-white flex m-4 p-5 shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4">
        <div>
          <p className="text-lg font-semibold text-slate-500">Clients inscrits</p>
          <div>
            <p className="text-xl pb-4 font-bold text-slate-500">200</p>
          </div>
          <div className='text-lg'>
            <span className="text-red-500 font-bold"> 25% </span>
            depuis hier
          </div>
        </div>
        <div>
          <div className="ml-7 w-10 h-10 bg-frenchRose-400 rounded-full text-white">
            <FontAwesomeIcon className='p-3' icon={faUserGroup} />
          </div>
        </div>
      </div>
    </div>
  );
}
