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
import { PropagateLoader } from 'react-spinners';
import {
  getCarStats,
  getLatestCars,
  getMonthlySalesStats,
  getDailyViewsStats,
  getDailyCarAdditions,
  getPriceStatsByBrand,
} from '../../services/ApiCar';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Enregistrement des composants Chart.js
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

// Fonction utilitaire pour formater les dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
};

// Composant pour afficher une carte de statistique
const StatCard = ({ title, value, format }) => (
  <div className="bg-white rounded-xl shadow-sm p-4">
    <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-800 mt-1">
      {format ? format(value) : value}
    </p>
  </div>
);

// Composant pour afficher le tableau des dernières annonces
const LatestCarsTable = ({ cars, tableHeaderStyle, tableCellStyle }) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <div className="p-4 bg-gray-50 border-b">
      <h3 className="text-lg font-semibold text-gray-800">Dernières Annonces</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className={tableHeaderStyle}>Modèle</th>
            <th className={tableHeaderStyle}>Année</th>
            <th className={tableHeaderStyle}>Prix</th>
            <th className={tableHeaderStyle}>Vendeur</th>
            <th className={tableHeaderStyle}>Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {cars.map(car => (
            <tr key={car._id}>
              <td className={`${tableCellStyle} font-medium`}>
                {car.marque} {car.model}
              </td>
              <td className={tableCellStyle}>{car.year}</td>
              <td className={`${tableCellStyle} font-semibold text-blue-600`}>
                {car.price?.toLocaleString() || 'N/A'} TND
              </td>
              <td className={tableCellStyle}>
                <div className="flex items-center">
                  {car.userID?.username || 'Anonyme'}
                </div>
              </td>
              <td className={tableCellStyle}>{formatDate(car.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const handleDownloadPDF = async () => {
  const dashboard = document.getElementById("dashboard-content");
  if (!dashboard) return;
  const canvas = await html2canvas(dashboard, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save("dashboard-rapport.pdf");
};

const DashboardAdmin = () => {
  const [stats, setStats] = useState(null);
  const [latestCars, setLatestCars] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [dailyViews, setDailyViews] = useState([]);
  const [dailyCarAdditions, setDailyCarAdditions] = useState([]);
  const [priceStats, setPriceStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, padding: 10 },
    },
  };

  const tableHeaderStyle = 'px-4 py-3 bg-blue-50 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider';
  const tableCellStyle = 'px-4 py-3 text-sm text-gray-700';

  const fetchDashboardData = async () => {
    try {
      setError(null);
      
      const [
        statsData,
        latestCarsData,
        monthlyStatsData,
        viewsData,
        dailyCarAdditionsData,
        priceStatsData,
      ] = await Promise.all([
        getCarStats(),
        getLatestCars(),
        getMonthlySalesStats(),
        getDailyViewsStats(),
        getDailyCarAdditions(),
        getPriceStatsByBrand(),
      ]);

      // Vérifier si les données sont valides
      if (!statsData?.data || !latestCarsData?.data) {
        throw new Error('Données invalides reçues du serveur');
      }

      setStats(statsData.data || {});
      setLatestCars(Array.isArray(latestCarsData.data) ? latestCarsData.data : []);
      setMonthlyStats(Array.isArray(monthlyStatsData.data) ? monthlyStatsData.data : []);
      setDailyViews(Array.isArray(viewsData.data) ? viewsData.data : []);
      setDailyCarAdditions(Array.isArray(dailyCarAdditionsData.data) ? dailyCarAdditionsData.data : []);
      setPriceStats(Array.isArray(priceStatsData.data) ? priceStatsData.data : []);
      
      console.log('dailyViews after fetch:', viewsData.data);
      console.log('dailyCarAdditions after fetch:', dailyCarAdditionsData.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError(error.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial des données
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const dailyCarAdditionsData = {
    labels: dailyCarAdditions.map(d => formatDate(d._id.date)),
    datasets: [{
      label: 'Voitures ajoutées',
      data: dailyCarAdditions.map(d => d.count),
      borderColor: '#4F46E5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      tension: 0.3,
    }],
  };

  const energyTypeData = stats?.energyTypes
    ? {
        labels: stats.energyTypes.map(type => type._id || 'Inconnu'),
        datasets: [{
          data: stats.energyTypes.map(type => type.count),
          backgroundColor: [
            '#3B82F6', '#6366F1', '#10B981', '#F59E0B',
            '#EF4444', '#8B5CF6', '#06B6D4', '#F97316',
          ],
          hoverOffset: 10,
        }],
      }
    : null;

  const priceStatsData = {
    labels: priceStats.map(b => b._id),
    datasets: [{
      label: 'Prix moyen (TND)',
      data: priceStats.map(b => b.avgPrice),
      backgroundColor: '#3B82F6',
      borderWidth: 1,
    }],
  };

  // Calculer le total des vues à partir de dailyViews
  const totalDailyViews = dailyViews.reduce((sum, view) => sum + view.count, 0);

  // Calculer le nombre de voitures ajoutées aujourd'hui
  const todayFormatted = formatDate(new Date());
  const carsAddedToday = dailyCarAdditions.find(d => formatDate(d._id.date) === todayFormatted)?.count || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <PropagateLoader color="#3B82F6" />
          <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      
      {/* En-tête avec boutons de contrôle */}
      <div className="flex justify-end max-w-7xl mx-auto mt-10 px-4">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition flex items-center gap-2"
        >
          Télécharger le rapport PDF
        </button>
      </div>

      {/* Contenu du dashboard */}
      <div id="dashboard-content" className="mr-4 max-w-7xl mx-auto mt-10 space-y-8">
        {/* Section des cartes de statistiques */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Voitures"
            value={stats?.totalCars?.[0]?.count || 0}
            format={value => value.toLocaleString()}
          />
          <StatCard
            title="Voitures ajoutées aujourd'hui"
            value={carsAddedToday}
            format={value => value.toLocaleString()}
          />
          <StatCard
            title="Prix Moyen"
            value={stats?.averagePrice?.[0]?.avg}
            format={value => value ? `${Math.round(value).toLocaleString()} TND` : 'N/A'}
          />
          <StatCard
            title="Marques Populaires"
            value={stats?.brands?.length || 0}
          />
        </section>

        {/* Section des graphiques principaux */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Évolution des ajouts de voitures (par jour)
            </h3>
            <div className="h-80">
              <Line
                data={dailyCarAdditionsData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { text: 'Ajouts quotidiens', display: true },
                  },
                  scales: {
                    y: {
                      min: 0,
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Répartition énergétique</h3>
            <div className="h-80 relative">
              {energyTypeData ? (
                <Doughnut
                  data={energyTypeData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      tooltip: {
                        callbacks: {
                          label: ctx =>
                            `${ctx.label}: ${ctx.raw} (${(
                              (ctx.raw * 100) /
                              ctx.dataset.data.reduce((a, b) => a + b, 0)
                            ).toFixed(1)}%)`,
                        },
                      },
                    },
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section tableau et graphique des prix */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LatestCarsTable
            cars={latestCars}
            tableHeaderStyle={tableHeaderStyle}
            tableCellStyle={tableCellStyle}
          />
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Prix moyen par marque</h3>
            <div className="h-96">
              <Bar
                data={priceStatsData}
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Prix moyen (TND)',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default DashboardAdmin;