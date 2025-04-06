import React, { useState, useEffect } from 'react';
import {getUserNotifications } from '../services/ApiNotifiations';
import { PropagateLoader } from 'react-spinners';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function NotificationsCards() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await getUserNotifications();
      
      // Vérification type de la réponse
      if (response.data?.success && Array.isArray(response.data.notifications)) {
        setNotifications(response.data.notifications);
      } else {
        
        setNotifications([]);
      }
    } catch (error) {
      console.error(error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    AOS.init({ duration: 1000, once: true });
    return () => AOS.refresh();
  }, []);

  return (
    <div className="min-h-screen p-4">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <PropagateLoader color="#3B82F6" size={15} speedMultiplier={0.8} />
        </div>
      ) : (
        <>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="p-6 mb-4 bg-white rounded-lg shadow-md transition hover:shadow-lg"
                data-aos="fade-up"
              >
                <p className="text-gray-800 text-lg font-medium">
                  {notification.content}
                </p>
                {notification.createdAt && (
                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-8">
              Aucune notification disponible
            </div>
          )}
        </>
      )}
    </div>
  );
}