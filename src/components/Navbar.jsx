import { useNavigate, Link, useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { getUsersbyId } from "../services/ApiUser";
import { getUserNotifications, markAsRead } from "../services/ApiNotifiations";
import LoginIcon from "@mui/icons-material/Login";
import { PropagateLoader } from "react-spinners";
import { IoIosNotificationsOutline } from "react-icons/io";
import AOS from "aos";
import "aos/dist/aos.css";
import NotificationsCards from "./notificationsCards";

function Navbar() {
  const [user, setUser] = useState({ user_image: null });
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasViewedNotifications, setHasViewedNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("authToken");
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Gestion des clics exterieurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // get user data
  useEffect(() => {
    if (isLoggedIn) {
      getUsersbyId()
        .then((response) => {
          setUser({
            user_image: response?.data?.user?.user_image || null,
          });
        })
        .catch(() => setUser({ user_image: null }))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // get touts les notifications
  const getNotifications = useCallback(async () => {
    setLoadingNotifications(true);
    try {
      const response = await getUserNotifications();
      if (response.data?.success && response.data.notifications) {
        const fetchedNotifications = response.data.notifications
          .filter(n => n._id || n.id)
          .map(n => ({ ...n, _id: n._id || n.id }));
        setNotifications(fetchedNotifications);

        if (!hasViewedNotifications) {
          const newUnread = fetchedNotifications.filter((n) => !n.read).length;
          setUnreadCount(newUnread);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingNotifications(false);
    }
  }, [hasViewedNotifications]);

  // gestion d'evenment clik sur l'icône de notifications
  const handleNotificationClick = async () => {
    const willShow = !showNotifications;
    setShowNotifications(willShow);

    if (willShow) {
      await getNotifications();

      if (unreadCount > 0) {
        // Marquer toutes les notifications comme lues
        // On prend tous les IDs valides
        const ids = notifications.map(n => n._id || n.id).filter(Boolean);
        console.log('IDs des notifications à marquer comme lues:', ids);
        for (const notificationId of ids) {
          if (!notificationId || notificationId === "undefined") {
            console.error('ID de notification invalide:', notificationId);
            continue;
          }
          try {
            await markAsRead(notificationId);
          } catch (error) {
            console.error('Erreur lors du markAsRead:', { error, notificationId });
          }
        }
        setHasViewedNotifications(true);
        setUnreadCount(0); 
      }
    }
  };

  //refraichemet des notifications
  useEffect(() => {
    if (!hasViewedNotifications && isLoggedIn) {
      getNotifications();

      const interval = setInterval(() => {
        getNotifications();
      }, 300000); 

      return () => clearInterval(interval);
    }
  }, [hasViewedNotifications, isLoggedIn, getNotifications]);

  const handleLogin = () => navigate("/login");
  const handleProfile = () => navigate("/profil");

  const NavigationLink = ({ to, children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = (e) => {
      e.preventDefault();
      if (to === '/') {
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const sectionId = to.replace('/', '');
        if (location.pathname !== '/') {
          navigate('/', { state: { scrollTo: sectionId } });
        } else {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    return (
      <li>
        <a
          href={to}
          onClick={handleClick}
          className="hover:text-blue-400 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-sky-800"
        >
          {children}
        </a>
      </li>
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?marque=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-sky-900 text-white w-full shadow-lg fixed top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 flex-shrink-0 hover:opacity-90 transition-opacity"
          data-aos="fade-right"
        >
          <img
            src="/logo.png"
            alt="Logo AutoMarket"
            className="h-10 w-10 object-contain"
          />
          <span className="text-base font-bold truncate">AutoMarket</span>
        </Link>

        <div className="flex-grow flex justify-center">
          <ul className="flex gap-6 text-sm font-medium">
            <NavigationLink to="/">Accueil</NavigationLink>
            <NavigationLink to="about-us">À Propos</NavigationLink>
            <NavigationLink to="services">Services</NavigationLink>
            <NavigationLink to="contact">Contact</NavigationLink>
          </ul>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          {loading ? (
            <div className="flex items-center justify-center"></div>
          ) : isLoggedIn ? (
            <>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleNotificationClick}
                  className="relative p-2 hover:text-blue-400 transition-colors"
                  aria-label="Notifications"
                  data-aos="zoom-in"
                >
                  <IoIosNotificationsOutline className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 max-h-[80vh] overflow-y-auto border border-gray-100">
                    <div className="sticky top-0 p-4 bg-white border-b border-gray-200 flex justify-between items-center z-10">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        Notifications
                      </h3>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    {loadingNotifications ? (
                      <div className="flex justify-center p-4">
                        <div className="text-center">
                          <PropagateLoader color="#3B82F6" size={8} />
                          <p className="mt-2 text-gray-600 text-sm">Chargement...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 notifications-container">
                        <NotificationsCards 
                          initialNotifications={notifications} 
                          compact={true} 
                          onClose={() => setShowNotifications(false)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleProfile}
                className="w-10 h-10 rounded-full overflow-hidden border border-white hover:border-blue-400 transition-colors"
                aria-label="Profil utilisateur"
                data-aos="zoom-in"
              >
                {user.user_image ? (
                  <img
                    src={user.user_image}
                    alt="Photo de profil"
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
              data-aos="zoom-in"
            >
              <LoginIcon fontSize="small" />
              <span>Login</span>
            </button>
          )}
        </div>
      </nav>
      <InitAOS />
    </div>
  );
}
const InitAOS = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    return () => AOS.refresh();
  }, []);

  return null;
};

export default Navbar;
