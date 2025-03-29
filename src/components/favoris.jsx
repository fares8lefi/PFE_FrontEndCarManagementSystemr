import React, { useEffect, useState } from "react";
import { getUserFavorites } from "../services/ApiFavoris";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Favoris() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getFavorites = async () => {
    try {
      const response = await getUserFavorites();
      console.log("Réponse des favoris:", response.data);
      if (response.data?.favorites) {
        setFavorites(response.data.favorites);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des favoris:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getFavorites();
  }, []);

  const handleCarClick = (id) => {
    navigate(`/carDetaille/${id}`);
  };

  if (loading) {
    return <div className="text-center mt-6">Chargement en cours</div>;
  }

  return (
    <div className="p-4 mx-auto max-w-4xl">
      <div className="flex flex-col space-y-4">
        {favorites.length === 0 ? (
          <p className="text-center w-full">Aucun favori trouvé.</p>
        ) : (
          favorites.map((car, index) => (
            <div
              key={car._id ? car._id : index}
              className="flex items-center rounded-xl overflow-hidden shadow-lg border p-4 bg-white cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleCarClick(car._id)}
            >
              {/* Image */}
              <div className="w-1/3 h-32 flex items-center justify-center bg-gray-300">
                {car?.cars_images && car.cars_images.length > 0 ? (
                  <img
                    src={car.cars_images[0]}
                    alt={`${car.marque} ${car.model}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">Image non disponible</span>
                )}
              </div>

              {/* les Informations*/}
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
                    <span>💰</span> ${car.price}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-red-600 font-bold text-lg">${car.price}</p>
                  <button
                    className="text-red-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FavoriteIcon fontSize="small" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
