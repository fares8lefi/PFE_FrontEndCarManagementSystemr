import React, { useState } from 'react';
import { FaBars, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import DashboardAdmin from '../AdminComponent/DashboardAdmin';
import UsersManagement from '../AdminComponent/UsersManagement';
import CarMangement from '../AdminComponent/CarManagement';

// Composant Navbar
const Navbar = ({ toggleSidebar }) => (
  <nav className="sticky top-0 z-40 bg-white shadow-md">
    <div className="flex items-center justify-between px-6 py-4">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg hover:bg-gray-100"
        aria-label="Ouvrir la sidebar"
      >
        <FaBars className="text-gray-600 text-xl" />
      </button>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-gray-600">
          <FaUserCircle className="text-2xl" />
          <span className="font-medium">Admin</span>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200">
          <FaSignOutAlt />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  </nav>
);

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed h-full bg-white shadow-lg w-64 transition-transform z-50 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6">
          <nav className="space-y-2">
            {[ 
              { key: 'dashboard', label: 'Tableau de bord' },
              { key: 'CarMangement', label: 'Gestion des voitures' },
              { key: 'UsersManagement', label: 'Utilisateurs' },
              { key: 'announcements', label: 'Annonces' },
              { key: 'notifications', label: 'Notifications' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveMenu(item.key)}
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

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="p-6 max-w-7xl mx-auto mt-6">
          {activeMenu === 'dashboard' && <DashboardAdmin />}
          {activeMenu === 'CarMangement' && <CarMangement />}
          {activeMenu === 'UsersManagement' && <UsersManagement />}
          {activeMenu === 'announcements' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-800">Gestion des annonces</h2>
              <p className="mt-2 text-gray-600">Contenu de la gestion des annonces à venir.</p>
            </div>
          )}
          {activeMenu === 'notifications' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
              <p className="mt-2 text-gray-600">Contenu des notifications à venir.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;