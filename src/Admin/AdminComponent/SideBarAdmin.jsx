import React, { useState } from 'react';
import DashboardAdmin from '../AdminComponent/DashboardAdmin';
import UsersManagement from '../AdminComponent/UsersManagement';
import CarMangement from '../AdminComponent/CarManagement';

// Composant Sidebar
const Sidebar = ({ activeMenu, setActiveMenu }) => (
  <aside className="fixed h-full bg-white shadow-lg w-64 z-50">
    <div className="p-6">
      <nav className="space-y-2">
        {[
          { key: 'dashboard', label: 'Tableau de bord' },
          { key: 'CarMangement', label: 'Gestion des voitures' },
          { key: 'UsersManagement', label: 'Utilisateurs' },
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
);

const AdminLayout = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  return (
    <div className="pt-16"> {/* Padding supérieur ajusté pour un navbar de 64px */}
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar toujours visible */}
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

        {/* Contenu principal avec marge à gauche */}
        <div className="flex-1 ml-64">
          <main className="p-6 max-w-7xl mx-auto">
            {activeMenu === 'dashboard' && <DashboardAdmin />}
            {activeMenu === 'CarMangement' && <CarMangement />}
            {activeMenu === 'UsersManagement' && <UsersManagement />}
            {activeMenu === 'notifications' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
                <p className="mt-2 text-gray-600">Contenu des notifications à venir.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;