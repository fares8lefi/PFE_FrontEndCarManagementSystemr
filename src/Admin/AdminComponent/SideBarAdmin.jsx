import React, { useState } from 'react';
import DashboardAdmin from '../AdminComponent/DashboardAdmin';
import UsersManagement from '../AdminComponent/UsersManagement';
import CarMangement from '../AdminComponent/CarManagement';
import MessagesMangement from '../AdminComponent/MessagesMangement';
import { broadcastNotification } from '../../services/ApiNotifiations';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AllCars from './AllCars';

// Composant Sidebar
const Sidebar = ({ activeMenu, setActiveMenu, onBroadcastClick }) => (
  <aside className="fixed h-full bg-white shadow-lg w-64 z-50">
    <div className="p-6">
      <nav className="space-y-2">
        {[ {
          key: 'dashboard',
          label: 'Tableau de bord'
        }, 
        {
          key: 'allCars',
          label: 'Home'
        },
        {
          key: 'CarMangement',
          label: 'Gestion des voitures'
        }, {
          key: 'UsersManagement',
          label: 'Utilisateurs'
        }, {
          key: 'MessagesMangement',
          label: 'Message'
        }, {
          key: 'notification',
          label: 'Envoyer une notification'
        }].map((item) => (
          <button
            key={item.key}
            onClick={() => item.key === 'notification' ? onBroadcastClick() : setActiveMenu(item.key)}
            className={`w-full text-left px-4 py-3 rounded-lg ${
              activeMenu === item.key ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  </aside>
);

const AdminLayout = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleBroadcastClick = () => {
    setShowBroadcastModal(true);
  };

  const handleSendNotification = async () => {
    if (!notificationMessage.trim()) {
      toast.error('Le message ne peut pas être vide');
      return;
    }

    try {
      setIsSending(true);
      await broadcastNotification(notificationMessage);
      toast.success('Notification envoyée à tous les utilisateurs');
      setNotificationMessage('');
      setShowBroadcastModal(false);
    } catch (error) {
      console.error('Error sending broadcast:', error);
      toast.error('Erreur lors de l\'envoi de la notification');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} onBroadcastClick={handleBroadcastClick} />
        
        <div className="flex-1 ml-64">
          <main className="p-6 max-w-7xl mx-auto">
            {activeMenu === 'dashboard' && <DashboardAdmin />}
            {activeMenu === 'allCars' && <AllCars />}
            {activeMenu === 'CarMangement' && <CarMangement />}
            {activeMenu === 'UsersManagement' && <UsersManagement />}
            {activeMenu === 'MessagesMangement' && <MessagesMangement/> }
          </main>
        </div>
      </div>

      {/* Modal de notification */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Envoyer une notification</h2>
            <textarea
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              placeholder="Entrez votre message..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                disabled={isSending}
              >
                Annuler
              </button>
              <button
                onClick={handleSendNotification}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Envoi...
                  </>
                ) : (
                  'Envoyer'
                )}
              </button>
            </div>
          </div>
        </div>
      )} 
    </div>
  );
};

export default AdminLayout;