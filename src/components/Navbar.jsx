import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('authToken');

  const Login = () => {
    navigate('/login');
  };

  return (
    <div className='bg-sky-900 text-white w-full min-w-md h-16 md:h-20 flex items-center'>
      <nav className='container mx-auto flex flex-col md:flex-row justify-between items-center px-4 h-full gap-2 md:gap-0'>
        
        {/* Section logo et nom */}
        <div className='flex items-center gap-2 w-full md:w-auto justify-between'>
          <div className='flex items-center gap-2 flex-none'>
            <img 
              src='/logo.png' 
              alt='Logo' 
              className='h-8 w-8 md:h-10 md:w-10 object-contain' 
            />
            <span className='text-xs md:text-sm lg:text-base font-bold truncate'>AutoMarket</span>
          </div>

          {/* Boton login version mobile */}
          {!isLoggedIn && (
            <button 
              onClick={Login}
              className='md:hidden bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-full 
                       text-xs transition-colors duration-300 flex items-center gap-1'
            >
              
              <span>Login</span>
            </button>
          )}
        </div>

        {/* Menu principal responsive */}
        <div className='w-full md:w-auto flex-1 flex justify-center'>
          <div className='flex flex-wrap justify-center gap-2 md:gap-4 lg:gap-6 text-sm'>
            <a href='/' className='hover:text-blue-400 px-2 py-1'>Home</a>
            <a href='/' className='hover:text-blue-400 px-2 py-1'>Neufs</a>
            <a href='/' className='hover:text-blue-400 px-2 py-1'>Occasion</a>
            <a href='/' className='hover:text-blue-400 px-2 py-1'>Inventory</a>
            <a href='/' className='hover:text-blue-400 px-2 py-1'>Contact</a>
          </div>
        </div>

        {/* Barre de recherche/bouton login version desktop */}
        <div className='w-full md:w-auto flex justify-end'>
          {isLoggedIn ? (
            <div className='relative w-full md:max-w-md'>
              <input
                type='text'
                placeholder='Rechercher...'
                className='w-full pl-3 pr-8 py-1 md:py-2 rounded-full bg-white/10 
                         text-xs md:text-sm placeholder-gray-300 focus:outline-none focus:ring-1 
                         focus:ring-blue-400 transition-all duration-300'
              />
              <svg
                className='w-4 h-4 absolute right-2 top-2 text-gray-300'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
            </div>
          ) : (
            <button 
              onClick={Login}
              className='hidden md:flex bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full 
                       text-sm transition-colors duration-300 items-center gap-1'
            >
              <span>🔑</span>{/*ajouter icon login */}
              <span>Login</span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;