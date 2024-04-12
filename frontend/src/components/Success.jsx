import React, { useState, useRef, useEffect } from 'react';
export default function 
() {

  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50'>
    <div   className='rounded-xl bg-white w-600 max-w-md md:max-w-lg lg:max-w-xl z-10 p-10  '>
        <div className='flex justify-center items-center mb-4'>
          <img src="system-regular-31-check(1).gif" className='text-red-500 w-20' alt="" />
      
        </div>
        <div>
          <div className='flex justify-center items-center mb-2'>
          <p className="font-semibold text-2xl">Succès</p>
          </div>
          <div className='flex justify-center items-center mb-7'>
          <p className='font-semi-bold'>
           Effectué avec succès
        </p>
          </div>

       
    </div>
    <div>
    </div>
    </div>
</div>
  )
}
