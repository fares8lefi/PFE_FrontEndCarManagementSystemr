import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FaSignOutAlt,
    FaUserCog
} from 'react-icons/fa';

const NavbarAdmin = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <nav className="bg-sky-900 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-2">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/admin/dashboard" className="flex items-center space-x-2">
                            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
                            <span className="font-bold text-lg hidden sm:block">Admin</span>
                        </Link>
                    </div>

                    {/* Espace vide au milieu */}
                    <div className="flex-1"></div>

                    {/* Profil et Déconnexion */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <Link
                            to="/admin/profile"
                            className="relative flex items-center space-x-1 px-2 py-2 rounded-md text-sm font-medium
                                text-gray-300 hover:bg-sky-800 hover:text-white transition-colors duration-200
                                group sm:px-3 sm:space-x-2"
                        >
                            <FaUserCog className="w-5 h-5" />
                            <span className="hidden sm:block">Profil</span>
                            <span className="absolute bg-black text-white text-xs px-2 py-1 rounded 
                                opacity-0 group-hover:opacity-100 pointer-events-none
                                transform -translate-y-full -translate-x-1/2 left-1/2
                                transition-opacity duration-200
                                sm:hidden
                                whitespace-nowrap
                                top-0">
                                Profil
                            </span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="relative flex items-center space-x-1 px-2 py-2 rounded-md text-sm font-medium
                                text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200
                                group sm:px-3 sm:space-x-2"
                        >
                            <FaSignOutAlt className="w-5 h-5" />
                            <span className="hidden sm:block">Déconnexion</span>
                            <span className="absolute bg-black text-white text-xs px-2 py-1 rounded 
                                opacity-0 group-hover:opacity-100 pointer-events-none
                                transform -translate-y-full -translate-x-1/2 left-1/2
                                transition-opacity duration-200
                                sm:hidden
                                whitespace-nowrap
                                top-0">
                                Déconnexion
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavbarAdmin;