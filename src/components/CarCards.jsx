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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
    return () => AOS.refresh();
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

  const CardDetail = ({ icon: Icon, label, value }) => (
    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
      <Icon className="text-blue-500 text-xl" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium">{value || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {loading ? (
        <div className="flex justify-center py-12">
          <PropagateLoader 
            color="#3B82F6"
            size={15}
            speedMultiplier={0.8}
          />
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-12">
          <GiCarKey className="mx-auto text-6xl text-gray-400 mb-4" />
          <p className="text-gray-500 text-xl">Aucun véhicule disponible</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div
              key={car._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              onClick={() => handleCarClick(car._id)}
              data-aos="fade-up"
            >
              <div className="relative h-64">
                {car.cars_images ? (
                  <img
                    src={car.cars_images} // Utilisation directe du base64 du backend
                    alt={`${car.marque} ${car.model}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <GiCarKey className="text-4xl text-gray-400" />
                  </div>
                )}
                <span className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  {car.statut || 'Disponible'}
                </span>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  {car.marque} {car.model} ({car.year})
                </h2>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <CardDetail 
                    icon={MdDateRange} 
                    label="Année" 
                    value={car.year} 
                  />
                  <CardDetail
                    icon={GiGasPump}
                    label="Énergie"
                    value={car.Energie}
                  />
                  <CardDetail
                    icon={TbManualGearbox}
                    label="Boîte"
                    value={car.Boite}
                  />
                  <CardDetail
                    icon={MdOutlineElectricalServices}
                    label="Puissance"
                    value={car.Puissance ? `${car.Puissance} CV` : null}
                  />
                </div>

                <div className="mb-4 space-y-2">
                  <p className="text-2xl font-bold text-blue-600">
                    {new Intl.NumberFormat('fr-FR').format(car.price)} TND
                  </p>
                  <p className="text-sm text-gray-500">
                    Kilométrage : {new Intl.NumberFormat('fr-FR').format(car.km)} km
                  </p>
                  {car.Position && (
                    <p className="text-sm text-gray-500">Localisation : {car.Position}</p>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/carDetaille/${car._id}`);
                    }}
                  >
                    Voir les détails
                  </button>
                  <button 
                    onClick={(e) => addFavoris(car._id, e)}
                    className="ml-2 p-3 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FavoriteIcon fontSize="medium" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}