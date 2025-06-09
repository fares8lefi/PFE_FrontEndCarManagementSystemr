import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavbarAdmin = () => {
    const navigate = useNavigate();
    const [userImage, setUserImage] = useState(null);
    const [user, setUser] = useState({});

    useEffect(() => {
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
        } else {
            // Optional: Redirect if user is not logged in
            // navigate('/login');
        }
    }, [navigate]); // Added navigate to dependency array

    const handleProfileClick = (e) => {
        e.preventDefault();
        navigate('/profilAdmin');
    };

    return (
        <nav className="bg-sky-900 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/homeAdmin" className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200">
                            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
                            <span className="font-bold text-lg">Admin Panel</span>
                        </Link>
                    </div>

                   
                

                    {/* Profil */}
                    <div className="flex items-center">
                        <button
                            onClick={handleProfileClick}
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-blue-800 transition-all duration-200"
                        >
                            <img
                                src={userImage || "/default-avatar.png"}
                                alt="Profil"
                                className="w-8 h-8 rounded-full object-cover border-2 border-white"
                                onError={e => { e.target.src = '/default-avatar.png'; }}
                            />
                            <span className="hidden sm:block">Profil</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavbarAdmin;
