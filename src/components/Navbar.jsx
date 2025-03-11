import { useState } from 'react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className='bg-sky-900 text-white w-full min-w-md h-16 md:h-20 flex items-center'>
      <nav className='container mx-auto flex justify-between items-center px-4 h-full'>
        
        {/* Logo + Nom avec version mobile */}
        <div className='flex items-center gap-2 flex-none w-32 md:w-40'>
          <img 
            src='/logo.png' 
            alt='Logo' 
            className='h-8 w-8 md:h-10 md:w-10 object-contain' 
          />
          <span className='text-xs md:text-sm lg:text-base font-bold truncate'>AutoMarket</span>
        </div>

        {/* Menu principal (caché sur mobile) */}
        <div className='hidden md:flex flex-grow justify-start ml-4 md:ml-8'>
          <div className='flex gap-2 md:gap-4 lg:gap-6'>
            <a href='/' className='hover:text-blue-400 transition-colors px-1 md:px-2 py-1 text-sm md:text-base'>Home</a>
            <a href='/' className='hover:text-blue-400 transition-colors px-1 md:px-2 py-1 text-sm md:text-base'>Neufs</a>
            <a href='/' className='hover:text-blue-400 transition-colors px-1 md:px-2 py-1 text-sm md:text-base'>Occasion</a>
            <a href='/' className='hover:text-blue-400 transition-colors px-1 md:px-2 py-1 text-sm md:text-base'>Inventory</a>
            <a href='/' className='hover:text-blue-400 transition-colors px-1 md:px-2 py-1 text-sm md:text-base'>Contact</a>
          </div>
        </div>

        {/* Barre de recherche adaptative */}
        <div className='flex flex-1 justify-end min-w-[120px] md:min-w-[200px]'>
          <div className='relative w-full max-w-xs md:max-w-md'>
            <input
              type='text'
              placeholder='Rechercher...'
              className='w-full pl-3 pr-8 md:pl-4 md:pr-10 py-1 md:py-2 rounded-full bg-white/10 
                       text-xs md:text-sm placeholder-gray-300 focus:outline-none focus:ring-1 md:focus:ring-2 
                       focus:ring-blue-400 transition-all duration-300'
            />
            <svg
              className='w-4 h-4 md:w-5 md:h-5 absolute right-2 md:right-3 top-2 md:top-2.5 text-gray-300'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
          </div>
        </div>

        {/* Menu hamburger mobile */}
        <button 
          className='md:hidden ml-4 p-2'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label='Menu mobile'
        >
          <svg 
            className='w-6 h-6' 
            fill='none' 
            stroke='currentColor' 
            viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
          </svg>
        </button>

        {/* Menu déroulant mobile */}
        {isMenuOpen && (
          <div className='md:hidden absolute top-16 left-0 right-0 bg-sky-900 z-50 py-4 px-6 space-y-4'>
            <a href='/' className='block hover:text-blue-400'>Home</a>
            <a href='/' className='block hover:text-blue-400'>Neufs</a>
            <a href='/' className='block hover:text-blue-400'>Occasion</a>
            <a href='/' className='block hover:text-blue-400'>Inventory</a>
            <a href='/' className='block hover:text-blue-400'>Contact</a>
          </div>
        )}

      </nav>
    </div>
  );
}

export default Navbar;