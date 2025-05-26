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
import { FaPhone } from 'react-icons/fa';
import { blurCarPlate } from "../services/ApiAI";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

export default function CarCards() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const [blurredImages, setBlurredImages] = useState({});
  const [processing, setProcessing] = useState({});

  const getCars = async () => {
    try {
      const res = await getAllCars();
      setCars(res.data.cars);

      // Traiter toutes les images
      res.data.cars.forEach(async (car) => {
        if (car.cars_images) {
          try {
            const imgResponse = await fetch(car.cars_images);
            const imgBlob = await imgResponse.blob();
            const resultBlob = await blurCarPlate(imgBlob);
            const url = URL.createObjectURL(resultBlob);
            setBlurredImages(prev => ({ ...prev, [car._id]: url }));
          } catch (e) {
            // fallback: image originale si erreur
            setBlurredImages(prev => ({ ...prev, [car._id]: car.cars_images }));
          }
        }
      });
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

  const addFavoris = async (carId, e) => {
    // Empêcher la propagation pour éviter de naviguer vers le détail
    if (e) e.stopPropagation();

    // Éviter plusieurs clics
    if (processing[carId]) return;
    
    setProcessing(prev => ({ ...prev, [carId]: true }));
    
    try {
      const response = await addCarToFavorites(carId);
      toast.success("Véhicule ajouté aux favoris !");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'ajout aux favoris");
    } finally {
      setProcessing(prev => ({ ...prev, [carId]: false }));
    }
  };
  
  const handleCarClick = (carId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.info('Veuillez vous connecter pour voir les détails de la voiture');
      navigate('/login');
      return;
    }
    navigate(`/carDetaille/${carId}`);
  };

  const handleBlurPlate = async (car) => {
    setProcessing(prev => ({ ...prev, [car._id]: true }));
    try {
      const imgResponse = await fetch(car.cars_images);
      const imgBlob = await imgResponse.blob();
      const resultBlob = await blurCarPlate(imgBlob);
      const url = URL.createObjectURL(resultBlob);
      setBlurredImages(prev => ({ ...prev, [car._id]: url }));
    } catch (e) {
      alert("Erreur lors du traitement IA");
    }
    setProcessing(prev => ({ ...prev, [car._id]: false }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <PropagateLoader color="#3B82F6" />
          <p className="mt-4 text-gray-600">Chargement des véhicules...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="vehicules-section" className="container mx-auto px-4 py-8 min-h-screen">
      
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
              <img
                src={blurredImages[car._id] || car.cars_images}
                alt={`${car.marque} ${car.model}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-car.jpg';
                }}
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${car.statut === "Disponible"
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  }`}>
                  {car.statut === "Disponible" ? 'Disponible' : 'Vendu'}
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

              {/* Position et Téléphone */}
              <div className="mb-4 space-y-2">
                {car.Position && (
                  <div className="px-3 py-1 bg-gray-50 rounded-lg inline-block">
                    <p className="text-sm text-gray-600">
                      📍 {car.Position}
                    </p>
                  </div>
                )}
                {car.phone && (
                  <div className="px-3 py-1 bg-gray-50 rounded-lg inline-block">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <FaPhone className="text-blue-600" />
                      {car.phone}
                    </p>
                  </div>
                )}
              </div>

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