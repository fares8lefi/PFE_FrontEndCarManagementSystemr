import { useNavigate, Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { getUsersbyId } from "../services/ApiUser";
import LoginIcon from '@mui/icons-material/Login';
import { PropagateLoader } from 'react-spinners'; 

function Navbar() {
  const [user, setUser] = useState({ user_image: null });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('authToken');

  useEffect(() => {
    if (isLoggedIn) {
      getUsersbyId()
        .then(response => {
          setUser({
            user_image: response?.data?.user?.user_image || null
          });
        })
        .catch(() => setUser({ user_image: null }))
        .finally(() => setLoading(false));
    } else {
      setUser({ user_image: null });
      setLoading(false);
    }
  }, [isLoggedIn]);

  const handleLogin = () => navigate('/login');
  const handleProfile = () => navigate('/profil');

  const NavigationLink = ({ to, children }) => (
    <li>
      <Link 
        to={to} 
        className="hover:text-blue-400 transition-colors duration-200"
      >
        {children}
      </Link>
    </li>
  );

  return (
    <div className="bg-sky-900 text-white w-full shadow-lg">
      <nav className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo et nom */}
        <Link 
          to="/" 
          className="flex items-center gap-2 flex-shrink-0 hover:opacity-90 transition-opacity"
        >
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-10 w-10 object-contain" 
          />
          <span className="text-base font-bold truncate">AutoMarket</span>
        </Link>

        {/* navigation */}
        <div className="flex-grow flex justify-center">
          <ul className="flex gap-6 text-sm font-medium">
            <NavigationLink to="/">Home</NavigationLink>
            <NavigationLink to="/about-us">About Us</NavigationLink>
            <NavigationLink to="/services">Services</NavigationLink>
            <NavigationLink to="/contact">Contact</NavigationLink>
          </ul>
        </div>

        {/* login botton ou barre de recherche et user image  */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {loading ? (
            <div className="flex items-center justify-center">
              <PropagateLoader 
                color="#3B82F6"
                size={10}
                speedMultiplier={0.8}
              />
            </div> 
          ) : isLoggedIn ? (
            <>
              <div className="relative w-full max-w-md min-w-[200px]">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-3 pr-10 py-2 rounded-full bg-white/10 text-sm placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all duration-300"
                  aria-label="Barre de recherche"
                />
                <svg
                  className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>

              <button
                onClick={handleProfile}
                className="w-10 h-10 rounded-full overflow-hidden border border-white hover:border-blue-400 transition-colors"
                aria-label="Profil utilisateur"
              >
                {user.user_image ? (
                  <img
                    src={user.user_image}
                    alt="Profil"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                    <span className="text-xs">?</span>
                  </div>
                )}
              </button>
            </>
          ) : (
            <button 
              onClick={handleLogin}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full text-sm flex items-center gap-1 transition-colors"
              aria-label="Se connecter"
            >
              <LoginIcon fontSize="small" />
              <span>Login</span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;