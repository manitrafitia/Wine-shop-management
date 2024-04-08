import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faWineBottle, faWineGlass, faUserGroup } from '@fortawesome/free-solid-svg-icons';

export default function Cards() {
  return (
    <div className="flex justify-center">
      <div className="rounded-2xl bg-white flex m-4 p-5 shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4">
        <div>
          <p className="text-lg font-semibold text-slate-500">Chiffre d'affaire</p>
          <div>
            <p className="text-xl pb-4 font-bold text-slate-500">20038 $</p>
          </div>
          <div className='text-lg'>
            <span className="text-green-500 font-bold"> +20% </span>
            depuis hier
          </div>
        </div>
        <div>
          <div className="ml-7 w-10 h-10 text-white rounded-full bg-indigo-500">
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
          <div className="ml-7 w-10 h-10 text-white rounded-full bg-emerald-500">
            <FontAwesomeIcon className='p-3' icon={faWineBottle} />
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-white flex m-4 p-5 shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4">
        <div>
          <p className="text-lg font-semibold text-slate-500">bouteilles produites</p>
          <div>
            <p className="text-xl pb-4 font-bold text-slate-500">2007</p>
          </div>
          <div className='text-lg'>
            <span className="text-red-500 font-bold"> -3% </span>
            depuis hier
          </div>
        </div>
        <div>
          <div className="ml-7 w-10 h-10 text-white rounded-full bg-yellow-500">
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
          <div className="ml-7 w-10 h-10 text-white rounded-full bg-purple-500">
            <FontAwesomeIcon className='p-3' icon={faUserGroup} />
          </div>
        </div>
      </div>
    </div>
  );
}
