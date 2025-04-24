import React, { useEffect, useState } from "react";
import { getUserFavorites, deleteFavoris } from "../services/ApiFavoris";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { PropagateLoader } from 'react-spinners';
import { GiGasPump } from 'react-icons/gi';
import { TbManualGearbox } from 'react-icons/tb';
import { MdDateRange } from 'react-icons/md';
import { AttachMoney, CheckCircle, Cancel } from '@mui/icons-material';

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

  const getStatusStyle = (statut) => {
    switch(statut?.toLowerCase()) {
      case 'disponible':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          icon: <CheckCircle className="w-4 h-4" />
        };
      case 'non disponible':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          icon: <Cancel className="w-4 h-4" />
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          icon: null
        };
    }
  };

  return (
    <div className="p-4 mx-auto max-w-4xl min-h-screen">
      {/* Titre et description */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Vos favoris</h1>
        <p className="text-gray-600">Retrouvez tous vos véhicules favoris en un seul endroit</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-full py-12">
          <PropagateLoader 
            color="#3B82F6"
            size={15}
            speedMultiplier={0.8}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-xl">Aucun favori trouvé</p>
            </div>
          ) : (
            favorites.map((car, index) => {
              const statusStyle = getStatusStyle(car.statut);
              
              return (
                <div
                  key={car._id ? car._id : index}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  data-aos="fade-up"
                >
                  {/* Image en haut */}
                  <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden shadow-inner mb-4">
                    {car?.cars_images && car.cars_images.length > 0 ? (
                      <img
                        src={car.cars_images[0]}
                        alt={`${car.marque} ${car.model}`}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50">
                        Image non disponible
                      </div>
                    )}
                  </div>

                  {/* Contenu principal */}
                  <div className="flex justify-between items-start">
                    {/* Informations à gauche */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-bold text-gray-800">
                          {car.marque} {car.model}
                        </h3>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                          {statusStyle.icon}
                          <span>{car.statut || 'Statut inconnu'}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 flex items-center gap-1 mb-4">
                        <MdDateRange fontSize="small" /> {car.year}
                      </p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors duration-300">
                          <span className="mr-2">
                            <GiGasPump fontSize="small" />
                          </span>
                          {car.Energie}
                        </div>
                      
                        <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors duration-300">
                          <span className="mr-2">
                            <TbManualGearbox fontSize="small" />
                          </span>
                          {car.Boite}
                        </div>
                        <div className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors duration-300">
                          <AttachMoney fontSize="small" className="mr-2" />
                          {car.price?.toLocaleString('fr-FR')} TND
                        </div>
                      </div>
                    </div>

                    {/* Actions à droite */}
                    <div className="flex flex-col gap-3 ml-4">
                      <button
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFavori(car._id);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                      <button
                        onClick={() => handleCarClick(car._id)}
                        className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm font-medium shadow-sm"
                      >
                        Voir détails
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}