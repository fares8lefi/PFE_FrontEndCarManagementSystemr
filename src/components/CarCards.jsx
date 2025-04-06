import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCars } from "../services/ApiCar";
import { addCarToFavorites } from "../services/ApiFavoris";
import FavoriteIcon from '@mui/icons-material/Favorite';
import AOS from 'aos'; 
import 'aos/dist/aos.css';
import { PropagateLoader } from 'react-spinners';

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

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <PropagateLoader 
            color="#3B82F6"
            size={15}
            speedMultiplier={0.8}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-24 mt-6 mb-6">
          {cars.length === 0 ? (
            <p className="col-span-full text-center">Aucune voiture trouvée.</p>
          ) : (
            cars.map((car) => (
              <div
                key={car._id}
                className="rounded-xl overflow-hidden shadow-lg border p-4 bg-white cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => handleCarClick(car._id)}
                data-aos="fade-up"  // Animation uniquement sur les cartes
              >
                <div className="bg-gray-300 h-40 w-full flex items-center justify-center">
                  {car?.cars_images ? (
                    <img
                      src={car.cars_images}
                      alt={`${car.marque} ${car.model}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-gray-500">Image non disponible</span>
                  )}
                </div>
                <div className="py-4">
                  <p className="text-sm text-gray-500">{car.model}</p>
                  <h2 className="text-xl font-bold">{car.marque}</h2>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-700">
                    <p className="flex items-center gap-1">
                      <span>🛢️</span> {car.fuelType}
                    </p>
                    <p className="flex items-center gap-1">
                      <span>📊</span> {car.statut}
                    </p>
                    <p className="flex items-center gap-1">
                      <span>📅</span> {car.year}
                    </p>
                    <p className="flex items-center gap-1">
                      <span>⚙️</span> {car.transmission}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-red-600 font-bold text-lg">${car.price}</p>
                    <button 
                      onClick={(e) => addFavoris(car._id, e)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FavoriteIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}