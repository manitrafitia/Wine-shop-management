import React from 'react';
import test from '../assets/icon.png';

export default function List() {
  return (
    <>
      <div className="p-5 rounded-2xl bg-white shadow overflow-y-auto max-h-96">
      <p className="text-lg font-semibold text-slate-500 text-center">Stock de vins disponibles</p>
        <ul>
          <li className="p-4 text-slate-500 border-b flex items-center">
            <img src={test} alt="" className="w-10 rounded-full" />
            <p className='ml-2'>Nom de vin 1</p>
            <div className="ml-auto">
              <p className="text-l font-bold">298</p>
            </div>
          </li>
          <li className="p-4 text-slate-500 border-b flex items-center">
            <img src={test} alt="" className="w-10 rounded-full" />
            <p className='ml-2'>Nom de vin 1</p>
            <div className="ml-auto">
              <p className="text-l font-bold">298</p>
            </div>
          </li>
          <li className="p-4 text-slate-500 border-b flex items-center">
            <img src={test} alt="" className="w-10 rounded-full" />
            <p className='ml-2'>Nom de vin 1</p>
            <div className="ml-auto">
              <p className="text-l font-bold">298</p>
            </div>
          </li>
          <li className="p-4 text-slate-500 border-b flex items-center">
            <img src={test} alt="" className="w-10 rounded-full" />
            <p className='ml-2'>Nom de vin 1</p>
            <div className="ml-auto">
              <p className="text-l font-bold">298</p>
            </div>
          </li>
          <li className="p-4 text-slate-500 border-b flex items-center">
            <img src={test} alt="" className="w-10 rounded-full" />
            <p className='ml-2'>Nom de vin 1</p>
            <div className="ml-auto">
              <p className="text-l font-bold">298</p>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
