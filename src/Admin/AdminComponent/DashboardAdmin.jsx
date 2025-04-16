import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
import {
  getDailyViewsStats,
  getLatestCars,
  getPriceStatsByBrand,
  getMonthlySalesStats,
  getCarsByYear,
  getCarStats
} from '../../services/ApiCar';

// Enregistrement des composants ChartJS
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

const DashboardAdmin = () => {
  const [stats, setStats] = useState(null);
  const [latestCars, setLatestCars] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [dailyViews, setDailyViews] = useState([]);
  const [loading, setLoading] = useState(true);

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, latestCarsData, monthlyStatsData, viewsData] = await Promise.all([
          getCarStats(),
          getLatestCars(),
          getMonthlySalesStats(),
          getDailyViewsStats()
        ]);

        setStats(statsData.data || {});
        setLatestCars(Array.isArray(latestCarsData.data) ? latestCarsData.data : []);
        setMonthlyStats(Array.isArray(monthlyStatsData.data) ? monthlyStatsData.data : []);
        setDailyViews(Array.isArray(viewsData.data) ? viewsData.data : []);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const salesData = {
    labels: monthlyStats.map(stat => `${stat._id.month}/${stat._id.year}`),
    datasets: [{
      label: 'Ventes mensuelles',
      data: monthlyStats.map(stat => stat.count),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    }]
  };

  const visitorData = {
    labels: dailyViews.map(view => view._id.date),
    datasets: [{
      label: 'Visiteurs',
      data: dailyViews.map(view => view.totalViews),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
    }]
  };

  const energyTypeData = stats?.energyTypes ? {
    labels: stats.energyTypes.map(type => type._id),
    datasets: [{
      data: stats.energyTypes.map(type => type.count),
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
      ],
    }]
  } : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { title: 'Total Voitures', value: stats?.totalCars?.[0]?.count || 0 },
          { title: 'Vues Totales', value: stats?.viewsStats?.[0]?.totalViews || 0 },
          {
            title: 'Prix Moyen',
            value: stats?.averagePrice?.[0]?.avg
              ? `${Math.round(stats.averagePrice[0].avg).toLocaleString()} €`
              : '0 €'
          },
          { title: 'Marques', value: stats?.brands?.length || 0 }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-3xl font-semibold text-gray-800 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-800 font-semibold mb-4">Évolution des ventes</h3>
          {monthlyStats.length > 0 ? (
            <Line data={salesData} options={chartOptions} />
          ) : (
            <p className="text-gray-500">Aucune donnée disponible pour les ventes mensuelles.</p>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-800 font-semibold mb-4">Visiteurs par jour</h3>
          {dailyViews.length > 0 ? (
            <Bar data={visitorData} options={chartOptions} />
          ) : (
            <p className="text-gray-500">Aucune donnée disponible pour les visiteurs.</p>
          )}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
          <h3 className="text-gray-800 font-semibold mb-4">Dernières Voitures</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marque/Modèle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Année</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendeur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {latestCars.map((car) => (
                  <tr key={car._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{car.marque} {car.model}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{car.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{car.price.toLocaleString()} €</td>
                    <td className="px-6 py-4 whitespace-nowrap">{car.userID?.username || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-800 font-semibold mb-4">Types d'Énergie</h3>
          {energyTypeData ? (
            <Doughnut data={energyTypeData} options={chartOptions} />
          ) : (
            <p className="text-gray-500">Aucune donnée disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
