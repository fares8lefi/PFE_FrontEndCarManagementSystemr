import React from 'react'

export default function AddCarAnnounecement() {
  return (
    <div className='w-full min-w-xl'>
    <p className='text-xl text-center mt-24 font-bold mb-8'>
      Best deals ? Create your announcement here
    </p>
    
    <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4'>
      {/* Colonne 1 */}
      <div className='space-y-6'>
        <input 
          type="text" 
          placeholder='Marque' 
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
        <input 
          type="text" 
          placeholder='Model' 
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
        <input 
          type="text" 
          placeholder='year' 
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none  focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
        <input 
          type="text" 
          placeholder='Kelométrage' 
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
      </div>
  
      {/* Colonne 2 */}
      <div className='space-y-6'>
        <input 
          type="text" 
          placeholder='Price' 
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
        <input 
          type="text" 
          placeholder='Puissance physical' 
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
        <select 
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    defaultValue="Essence"
  >
    <option value="Essence">Essence</option>
    <option value="Diesel">Diesel</option>
    <option value="Hybrid">Hybrid</option>
    <option value="Electric">Electric</option>
  </select>
   
  <select 
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    defaultValue=""
  >
    <option value="Manuelle">Manuelle</option>
    <option value="Auto">Auto</option>
 
  </select>
   
      </div>
  
      {/* Colonne 3 */}
      <div className='space-y-6'>
        <input 
          type="text" 
          placeholder='Position' 
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
        <input 
           type="file"
           accept="image/*"
           multiple
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
        <input 
          type="text" 
          placeholder='Dites en plus sur le véhicule' 
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
        <input 
          type="text" 
          placeholder='Phone' 
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
        <button className='w-full bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300'>
          Publier
        </button>
      </div>
    </div>
  </div>
  )
}
