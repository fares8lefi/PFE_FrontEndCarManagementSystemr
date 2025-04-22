import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCars } from "../services/ApiCar";
import { addCarToFavorites } from "../services/ApiFavoris";
import FavoriteIcon from '@mui/icons-material/Favorite';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { PropagateLoader } from 'react-spinners';
import { GiGasPump, GiCarKey } from 'react-icons/gi';
import { MdOutlineElectricalServices, MdDateRange } from 'react-icons/md';
import { TbManualGearbox } from 'react-icons/tb';

export default function CarCards() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const getCars = async () => {
    try {
      const res = await getAllCars();
      setCars(res.data.cars);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCars();
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  const handleCarClick = (id) => {
    const logged = localStorage.getItem("authToken");
    if (!id) return;

    logged 
      ? navigate(`/carDetaille/${id}`)
      : navigate("/login", {
          state: {
            from: `/carDetaille/${id}`,
            message: "Veuillez-vous connecter pour accéder aux détails du véhicule",
          },
        });
  };

  const addFavoris = async (carId, e) => {
    e.stopPropagation();
    try {
      if (!localStorage.getItem("authToken")) {
        navigate("/login", {
          state: {
            from: window.location.pathname,
            message: "Veuillez vous connecter pour ajouter aux favoris",
          },
        });
        return;
      }
      await addCarToFavorites(carId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="vehicules-section" className="container mx-auto px-4 py-8 min-h-screen">
      {/* Filtres */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <button 
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              filter === 'all' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          <button 
            onClick={() => setFilter('new')}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              filter === 'new' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Nouveautés
          </button>
          <button 
            onClick={() => setFilter('popular')}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              filter === 'popular' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Populaires
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <PropagateLoader color="#3B82F6" size={15} speedMultiplier={0.8} />
          <p className="text-gray-500">Chargement des véhicules...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div
              key={car._id}
              onClick={() => handleCarClick(car._id)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
              data-aos="fade-up"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-gray-100">
                {car.cars_images ? (
                  <img
                    src={car.cars_images}
                    alt={`${car.marque} ${car.model}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-car.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">Aucune image disponible</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    car.count > 0 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {car.count > 0 ? 'Disponible' : 'Non disponible'}
                  </span>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {car.marque} {car.model}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-gray-500 text-sm">
                        Année: {car.year}
                      </p>
                      {car.username && (
                        <span className="text-sm text-blue-600">
                          • Par {car.username}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => addFavoris(car._id, e)}
                    className="p-2 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <FavoriteIcon className="text-red-500" />
                  </button>
                </div>

                {/* Specifications Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                    <GiGasPump className="text-blue-600 text-xl" />
                    <div>
                      <p className="text-xs text-gray-500">Énergie</p>
                      <p className="text-sm font-medium">{car.Energie}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                    <TbManualGearbox className="text-blue-600 text-xl" />
                    <div>
                      <p className="text-xs text-gray-500">Boîte</p>
                      <p className="text-sm font-medium">{car.Boite}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                    <MdDateRange className="text-blue-600 text-xl" />
                    <div>
                      <p className="text-xs text-gray-500">Kilométrage</p>
                      <p className="text-sm font-medium">{car.km?.toLocaleString()} km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                    <MdOutlineElectricalServices className="text-blue-600 text-xl" />
                    <div>
                      <p className="text-xs text-gray-500">Puissance</p>
                      <p className="text-sm font-medium">{car.Puissance || 'N/A'} ch</p>
                    </div>
                  </div>
                </div>

                {/* Position si disponible */}
                {car.Position && (
                  <div className="mb-4 px-3 py-1 bg-gray-50 rounded-lg inline-block">
                    <p className="text-sm text-gray-600">
                      📍 {car.Position}
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-2xl font-bold text-blue-600">
                    {car.price?.toLocaleString()} TND
                  </span>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCarClick(car._id);
                    }}
                  >
                    Voir détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message si aucune voiture */}
      {!loading && cars.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Aucun véhicule disponible pour le moment.
          </p>
        </div>
      )}
    </div>
  );
}