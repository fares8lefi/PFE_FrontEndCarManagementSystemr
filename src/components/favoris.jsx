import React, { useEffect, useState } from "react";
import { getUserFavorites, deleteFavoris } from "../services/ApiFavoris";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { PropagateLoader } from 'react-spinners';

export default function Favoris() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getFavorites = async () => {
    try {
      const response = await getUserFavorites();
      if (response.data?.favorites) {
        setFavorites(response.data.favorites);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    } 
  };

  const deleteFavori = async (favoriId) => {
    try {
      const response = await deleteFavoris(favoriId);
      if (response.status === 200) {
        setFavorites(response.data.favorites);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    getFavorites();
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleCarClick = (id) => {
    navigate(`/carDetaille/${id}`);
  };

  return (
    <div className="p-4 mx-auto max-w-4xl min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-full py-12">
          <PropagateLoader 
            color="#3B82F6"
            size={15}
            speedMultiplier={0.8}
          />
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-xl">Aucun favori trouvé</p>
            </div>
          ) : (
            favorites.map((car, index) => (
              <div
                key={car._id ? car._id : index}
                className="flex items-center rounded-xl overflow-hidden shadow-lg border p-4 bg-white cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => handleCarClick(car._id)}
                data-aos="fade-up"
              >
                {/* Image */}
                <div className="w-1/3 h-32 flex items-center justify-center bg-gray-300">
                  {car?.cars_images && car.cars_images.length > 0 ? (
                    <img
                      src={car.cars_images[0]}
                      alt={`${car.marque} ${car.model}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-gray-500">Image non disponible</span>
                  )}
                </div>

                {/* Informations */}
                <div className="w-2/3 pl-4">
                  <h2 className="text-xl font-bold">
                    {car.marque} {car.model}
                  </h2>
                  <p className="text-sm text-gray-500">{car.year}</p>
                  <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-700">
                    <p className="flex items-center gap-1">
                      <span>🛢️</span> {car.fuelType}
                    </p>
                    <p className="flex items-center gap-1">
                      <span>⚙️</span> {car.transmission}
                    </p>
                    <p className="flex items-center gap-1">
                      <span>💰</span> {car.price?.toLocaleString('fr-FR')} €
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-red-600 font-bold text-lg">
                      {car.price?.toLocaleString('fr-FR')} €
                    </p>
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFavori(car._id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}