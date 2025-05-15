import React, { useState, useEffect } from 'react';
import { getUserNotifications, markAsRead } from '../services/ApiNotifiations';
import { PropagateLoader } from 'react-spinners';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Fonction utilitaire pour générer un ID unique fallback
const generateUID = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export default function NotificationsCards({ initialNotifications = null, compact = false, onClose = null }) {
  const [notifications, setNotifications] = useState(initialNotifications || []);
  const [loading, setLoading] = useState(initialNotifications === null);
  const navigate = useNavigate();

  useEffect(() => {
    // Si des notifications initiales sont fournies, les utiliser
    if (initialNotifications) {
      setNotifications(initialNotifications);
      setLoading(false);
      return;
    }

    // Sinon, récupération initiale
    const fetchNotifications = async () => {
      try {
        const response = await getUserNotifications();
        if (response.data?.success && Array.isArray(response.data.notifications)) {
          setNotifications(
            response.data.notifications
              .filter(n => n._id || n.id)
              .map(n => ({
                ...n,
                _id: n._id || n.id || generateUID()
              }))
          );
        } else {
          setNotifications([]);
        }
      } catch (error) {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    AOS.init({ duration: compact ? 0 : 1000, once: true });

    // Connexion socket.io (seulement en mode autonome)
    if (!compact) {
      const socket = io('http://localhost:3003', {
        withCredentials: true,
        transports: ['websocket'],
      });

      // Écoute des notifications en temps réel
      socket.on('newNotification', (notification) => {
        const processedNotification = {
          ...notification,
          _id: notification._id || notification.id || generateUID()
        };
        console.log("Notification WebSocket reçue:", processedNotification);
        setNotifications((prev) => [processedNotification, ...prev]);
      });

      return () => {
        socket.disconnect();
        AOS.refresh();
      };
    }
  }, [initialNotifications, compact]);

  // Préparer l'URL pour chaque notification
  const getNotificationUrl = (notification) => {
    if (notification.link) return notification.link;
    if (notification.carId) return `/carDetaille/${notification.carId}`;
    return null;
  };

  // Marquer comme lu avant navigation
  const handleMarkAsRead = async (event, notification) => {
    // Si pas d'ID valide, laisser la navigation se faire naturellement
    const notificationId = notification._id || notification.id;
    if (!notificationId || notificationId === "undefined") {
      console.warn("ID notification invalide:", notification);
      return; // Continue avec la navigation normale via <a href>
    }

    try {
      // Empêcher la navigation immédiate
      event.preventDefault();
      
      // Marquer comme lu
      await markAsRead(notificationId);
      console.log("Notification marquée comme lue:", notificationId);
      
      // Si on est dans la navbar, fermer le dropdown après clic
      if (compact && onClose) {
        onClose();
      }
      
      // Puis naviguer
      const url = getNotificationUrl(notification);
      if (url) {
        // Essayer d'utiliser navigate et fallback sur window.location
        try {
          navigate(url);
          console.log("Navigation via React Router:", url);
        } catch (error) {
          console.error("Erreur avec navigate, fallback sur window.location:", error);
          window.location.href = url;
        }
      }
    } catch (error) {
      console.error("Erreur lors du marquage comme lu:", error);
      // En cas d'erreur, continuer avec la navigation native
      const url = getNotificationUrl(notification);
      if (url) window.location.href = url;
    }
  };

  // Classes CSS conditionnelles en fonction du mode compact
  const containerClass = compact 
    ? "max-h-[50vh] overflow-y-auto" 
    : "min-h-screen p-4";
  
  const notificationClass = compact
    ? "block w-full p-3 mb-2 bg-white border-b last:border-b-0 transition relative overflow-hidden group"
    : "block w-full p-6 mb-4 bg-white rounded-lg shadow-md transition relative overflow-hidden group";

  return (
    <div className={containerClass}>
      {loading ? (
        compact ? (
          <div className="flex justify-center items-center py-8">
            <PropagateLoader color="#3B82F6" size={10} speedMultiplier={0.8} />
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <PropagateLoader color="#3B82F6" />
              <p className="mt-4 text-gray-600">Chargement des notifications...</p>
            </div>
          </div>
        )
      ) : (
        <>
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const url = getNotificationUrl(notification);
              return (
                <a
                  key={notification._id}
                  href={url || '#'}
                  onClick={(e) => url && handleMarkAsRead(e, notification)}
                  className={`${notificationClass}
                    ${url ? `hover:bg-blue-50 cursor-pointer ${notification.read ? '' : 'bg-blue-50'}` : 'cursor-default'}
                  `}
                  data-aos={compact ? '' : "fade-up"}
                >
                  {/* Effet visuel de clic */}
                  {url && (
                    <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 
                      group-active:opacity-10 transition-opacity duration-200"></div>
                  )}
                  
                  {/* Contenu de la notification */}
                  <div className="relative z-10">
                    <p className={`text-gray-800 ${compact ? 'text-sm' : 'text-lg'} font-medium mb-2`}>
                      {notification.content}
                    </p>
                    
                    {notification.createdAt && (
                      <div className="flex justify-between items-center">
                        <p className="text-gray-500 text-xs">
                          {new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric'
                          })}
                        </p>
                        
                        {url && !compact && (
                          <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full 
                            group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <span className="text-sm font-medium">Voir détails</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" 
                              fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        )}
                        
                        {url && compact && (
                          <span className="text-blue-600 text-xs">
                            → Voir
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </a>
              );
            })
          ) : (
            <div className={`text-center text-gray-500 ${compact ? 'py-4' : 'mt-8 p-8 bg-white rounded-lg shadow-sm'}`}>
              Aucune notification disponible
            </div>
          )}
        </>
      )}
    </div>
  );
}