import React from 'react'

export default function Contact() {
  return (
    <div className='m-20'>
        <div className='flex'>
          <div className="w-1/4"><h2 className="text-2xl font-bold">Envoyer un message</h2></div>      
          <div className='w-3/4 h-1 bg-rose-900 mt-4'></div>
        </div>
        <div className="flex m-8">
          <div className="w-1/2">
          <div>
          <label htmlFor="">Nom</label>
          <input type="text" className='w-full p-2 mt-2 mb-3 border border-charade-400 rounded-lg' />
          </div>
        <label htmlFor="">E-mail</label>
        <input type="email" name="" id="" className='w-full p-2 mt-2 mb-3 border border-charade-400 rounded-lg' />
        <label htmlFor="">Message</label>
        <textarea name="" id="" cols="30" rows="10" className='w-full p-2 mt-2 mb-3 border border-charade-400 rounded-lg'></textarea>
        <button className="px-4 py-2 bg-blue-700 rounded text-white">Envoyer</button>
          </div>
          <div className='w-1/2'>
            <h2>Nous</h2>
            <p>Tel</p>
            <p>Mail</p>
            <p>Adresse</p>
        </div>
        </div>
    </div>
  )
}
