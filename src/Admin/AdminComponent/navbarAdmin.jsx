import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

const NavbarAdmin = () => {
    const navigate = useNavigate();
    const [userImage, setUserImage] = useState(null);
    const [user, setUser] = useState({});

    useEffect(() => {
        // Récupération de l'image utilisateur et du rôle depuis le localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const userObj = JSON.parse(userData);
                setUserImage(userObj.user_image);
                setUser(userObj);
            } catch (e) {
                setUserImage(null);
                setUser({});
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleProfileClick = (e) => {
        e.preventDefault();
        navigate('/profilAdmin');
    };

    return (
        <nav className="bg-sky-900 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-2">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/homeAdmin" className="flex items-center space-x-2">
                            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
                            <span className="font-bold text-lg hidden sm:block">Admin</span>
                        </Link>
                    </div>

                    {/* Liens de navigation client et admin */}
                    <div className="flex-1 flex items-center justify-center space-x-6">
                        {/* Liens admin visibles seulement pour l'admin */}
                        {user.role === 'admin' && (
                            <>
                                <Link to="/homeAdmin" className="hover:underline font-semibold text-blue-200">Dashboard Admin</Link>
                                <Link to="/carManagement" className="hover:underline font-semibold text-blue-200">Gestion voitures</Link>
                                <Link to="/usersManagement" className="hover:underline font-semibold text-blue-200">Gestion utilisateurs</Link>
                                <Link to="/messagesMangement" className="hover:underline font-semibold text-blue-200">Messages</Link>
                                <Link to="/profilAdmin" className="hover:underline font-semibold text-blue-200">Profil Admin</Link>
                            </>
                        )}
                    </div>

                    {/* Profil et Déconnexion */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <button
                            onClick={handleProfileClick}
                            className="relative flex items-center space-x-1 px-2 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-sky-800 hover:text-white transition-colors duration-200 group sm:px-3 sm:space-x-2"
                        >
                            {userImage ? (
                                <img
                                    src={userImage}
                                    alt="Profil"
                                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                                    onError={e => { e.target.src = '/default-avatar.png'; }}
                                />
                            ) : (
                                <img
                                    src="/default-avatar.png"
                                    alt="Profil"
                                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                                />
                            )}
                            <span className="hidden sm:block">Profil</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="relative flex items-center space-x-1 px-2 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200 group sm:px-3 sm:space-x-2"
                        >
                            <FaSignOutAlt className="w-5 h-5" />
                            <span className="hidden sm:block">Déconnexion</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavbarAdmin;