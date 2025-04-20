import React, { useState } from 'react';
import {
  FaUsers,
  FaCar,
  FaBullhorn,
  FaBell,
  FaChartLine,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUserCircle
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const HomeAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <FaChartLine className="text-xl" /> },
    { id: 'cars', label: 'Gestion des voitures', icon: <FaCar className="text-xl" /> },
    { id: 'users', label: 'Utilisateurs', icon: <FaUsers className="text-xl" /> },
    { id: 'announcements', label: 'Annonces', icon: <FaBullhorn className="text-xl" /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell className="text-xl" /> },
  ];

  // Sample data for charts
  const salesData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Ventes mensuelles',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const visitorData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Visiteurs',
        data: [1200, 1900, 1500, 1800, 2100, 1700, 1600],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  const carTypeData = {
    labels: ['SUV', 'Berline', 'Citadine', 'Sport', 'Utilitaire'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-blue-600">Admin Panel</h2>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <FaTimes className="text-gray-500 text-xl" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeMenu === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        {/* Navbar */}
        <nav className="sticky top-0 z-40 bg-white shadow-md">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100"
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

        {/* Content Area */}
        <div className="p-6">
          {activeMenu === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-gray-500 text-sm font-medium">Total Voitures</h3>
                  <p className="text-3xl font-semibold text-gray-800 mt-2">150</p>
                  <span className="text-green-500 text-sm mt-2 flex items-center">
                    +12% ce mois
                  </span>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-gray-500 text-sm font-medium">Utilisateurs</h3>
                  <p className="text-3xl font-semibold text-gray-800 mt-2">1,234</p>
                  <span className="text-green-500 text-sm mt-2 flex items-center">
                    +25% ce mois
                  </span>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-gray-500 text-sm font-medium">Annonces</h3>
                  <p className="text-3xl font-semibold text-gray-800 mt-2">89</p>
                  <span className="text-yellow-500 text-sm mt-2 flex items-center">
                    +5% ce mois
                  </span>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-gray-500 text-sm font-medium">Ventes</h3>
                  <p className="text-3xl font-semibold text-gray-800 mt-2">45</p>
                  <span className="text-green-500 text-sm mt-2 flex items-center">
                    +18% ce mois
                  </span>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-gray-800 font-semibold mb-4">Évolution des ventes</h3>
                  <Line data={salesData} options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }} />
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-gray-800 font-semibold mb-4">Visiteurs par jour</h3>
                  <Bar data={visitorData} options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }} />
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                  <h3 className="text-gray-800 font-semibold mb-4">Dernières Transactions</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voiture</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">BMW X5 2024</td>
                          <td className="px-6 py-4 whitespace-nowrap">Jean Dupont</td>
                          <td className="px-6 py-4 whitespace-nowrap">75,000 €</td>
                          <td className="px-6 py-4 whitespace-nowrap">15 Avr 2025</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">Mercedes C200</td>
                          <td className="px-6 py-4 whitespace-nowrap">Marie Martin</td>
                          <td className="px-6 py-4 whitespace-nowrap">45,000 €</td>
                          <td className="px-6 py-4 whitespace-nowrap">14 Avr 2025</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">Audi A3</td>
                          <td className="px-6 py-4 whitespace-nowrap">Pierre Dubois</td>
                          <td className="px-6 py-4 whitespace-nowrap">35,000 €</td>
                          <td className="px-6 py-4 whitespace-nowrap">13 Avr 2025</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-gray-800 font-semibold mb-4">Types de Voitures</h3>
                  <Doughnut data={carTypeData} options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }} />
                </div>
              </div>
            </>
          )}
          {activeMenu === 'cars' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-800">Gestion des voitures</h2>
            </div>
          )}
          {activeMenu === 'users' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-800">Gestion des utilisateurs</h2>
            </div>
          )}
          {activeMenu === 'announcements' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-800">Gestion des annonces</h2>
            </div>
          )}
          {activeMenu === 'notifications' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-800">Envoi des notifications</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;