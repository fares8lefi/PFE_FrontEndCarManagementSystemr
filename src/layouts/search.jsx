import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FilterSidebar from "../components/FilterSidebar";
import { PropagateLoader } from "react-spinners";
import { getCarsByMarque, getCarsFiltered } from "../services/ApiCar";
import { GiCarKey } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filters, setFilters] = useState({});

  const searchParams = new URLSearchParams(location.search);
  const marque = searchParams.get("marque");

  const getCars = async () => {
    if (!marque) return;
    
    try {
      setIsLoading(true);
      setError(null);
      let response;
      
      // Log des filtres reçus
      console.log('Filtres reçus:', filters);
      
      // Formatage des filtres selon ce que le backend attend
      const formattedFilters = {
        marque,
        maxPrice: Number(filters.maxPrice) || 1000000,
        minYear: Number(filters.minYear) || 1900,
        maxYear: Number(filters.maxYear) || new Date().getFullYear(),
        minKm: Number(filters.minKm) || 0,
        maxKm: Number(filters.maxKm) || 1000000,
        Energie: filters.Energie || 'Diesel',
        Boite: filters.Boite || 'Manuelle'
      };

      // Log des filtres formatés
      console.log('Filtres formatés:', formattedFilters);

      // Vérification des filtres requis
      const requiredFilters = ['marque', 'maxPrice', 'minYear', 'maxYear', 'maxKm', 'Energie', 'Boite'];
      const missingFilters = requiredFilters.filter(filter => {
        const value = formattedFilters[filter];
        console.log(`Vérification du filtre ${filter}:`, value);
        return value === undefined || value === null || value === '';
      });

      if (missingFilters.length > 0) {
        console.log('Filtres manquants:', missingFilters);
        setError('Veuillez remplir tous les filtres requis');
        setCars([]);
        return;
      }

      if (Object.keys(filters).length === 0) {
        response = await getCarsByMarque(marque);
      } else {
        // Log pour débogage
        console.log('Envoi des filtres au backend:', formattedFilters);
        response = await getCarsFiltered(formattedFilters);
      }

      if (response.data.cars) {
        setCars(response.data.cars);
        // Si aucun résultat n'est trouvé, afficher un message
        if (response.data.cars.length === 0) {
          setError(`Aucun véhicule trouvé pour la marque "${marque}" avec les critères suivants :
            - Prix maximum : ${formattedFilters.maxPrice.toLocaleString()} TND
            - Année : ${formattedFilters.minYear} - ${formattedFilters.maxYear}
            - Kilométrage maximum : ${formattedFilters.maxKm.toLocaleString()} km
            - Énergie : ${formattedFilters.Energie}
            - Boîte : ${formattedFilters.Boite}`);
        }
      }
    } catch (err) {
      console.error('Erreur de recherche:', err);
      if (err.response) {
        console.error('Détails de l\'erreur:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        });
      }
      setError(err.response?.data?.message || "Erreur lors de la recherche des véhicules");
      setCars([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (marque) {
      setSearchTerm(marque);
      getCars();
    }
  }, [marque, filters]);

  // Ajout d'un useEffect pour le débogage des filtres
  useEffect(() => {
    console.log('État actuel des filtres:', filters);
  }, [filters]);

  const handleSearch = async (searchValue, currentFilters = {}) => {
    if (!searchValue.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const searchParams = {
        marque: searchValue.toString(),
        ...currentFilters
      };

      const response = await getCarsByMarque(searchValue.toString());
      setCars(response.data.cars || []);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la recherche");
      setCars([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login", {
        state: {
          from: location.pathname,
          message: "Veuillez vous connecter pour effectuer une recherche.",
        },
      });
      return;
    }
    const searchTermString = searchTerm.toString();
    navigate(`/search?marque=${encodeURIComponent(searchTermString)}`);
    handleSearch(searchTermString, filters);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  function getCarImageSrc(car) {
    if (!car.cars_images) return null;
    if (Array.isArray(car.cars_images) && car.cars_images.length > 0) {
      const img = car.cars_images[0];
      if (img && img.data && img.contentType) {
        return `data:${img.contentType};base64,${img.data}`;
      }
      return null;
    }
    // Si jamais c'est un objet unique
    if (car.cars_images.data && car.cars_images.contentType) {
      return `data:${car.cars_images.contentType};base64,${car.cars_images.data}`;
    }
    return null;
  }

  const isLoggedIn = !!localStorage.getItem("authToken");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex flex-1 mt-16">
        {/* Sidebar avec bouton toggle */}
        <div className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-30`}>
          <FilterSidebar 
            onFilterChange={handleFilterChange} 
            searchedMarque={marque}
          />
        </div>

        {/* Bouton toggle sidebar */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-r-lg shadow-lg z-40"
        >
          {isSidebarOpen ? '←' : '→'}
        </button>

        {/* Contenu principal */}
        <div className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-80' : 'ml-0'
        }`}>
          <div className="p-8">
            {/* Barre de recherche */}
            <div className="mb-8">
              <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher une marque..."
                  className="flex-1 px-6 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!isLoggedIn}
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  disabled={!isLoggedIn}
                >
                  <FaSearch />
                  Rechercher
                </button>
              </form>
              {!isLoggedIn && (
                <p className="text-red-500 mt-2">Veuillez vous connecter pour effectuer une recherche.</p>
              )}
            </div>

            {/* Résultats */}
            {marque && (
              <h1 className="text-2xl font-bold mb-6 text-gray-800">
                Résultats pour "{marque}"
              </h1>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <PropagateLoader color="#3B82F6" size={15} />
                <p className="mt-4 text-gray-500">Recherche en cours...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-xl bg-red-50 p-4 rounded-lg inline-block">
                  {error}
                </div>
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <GiCarKey className="mx-auto text-6xl text-gray-400 mb-4" />
                <p className="text-gray-500 text-xl mb-4">
                  Aucun véhicule trouvé pour la marque <strong>"{marque}"</strong>
                  {Object.keys(filters).length > 0 && " avec les filtres sélectionnés"}
                </p>
                <div className="max-w-md mx-auto">
                  <p className="text-sm text-gray-400 mb-4">
                    Suggestions :
                  </p>
                  <ul className="text-sm text-gray-500 space-y-2 text-left inline-block">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Essayez de modifier vos critères de recherche
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Vérifiez l'orthographe de la marque
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Réduisez le nombre de filtres appliqués
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Consultez d'autres marques similaires
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setFilters({});
                    setSearchTerm(marque);
                    getCars();
                  }}
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <div
                    key={car._id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/carDetaille/${car._id}`)}
                  >
                    <div className="relative h-48">
                      {getCarImageSrc(car) ? (
                        <img
                          src={getCarImageSrc(car)}
                          alt={`${car.marque} ${car.model}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-car.png';
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
                          <GiCarKey className="text-4xl text-gray-400 mb-2" />
                          <span className="text-sm text-gray-400">Aucune image disponible</span>
                        </div>
                      )}
                      <div
                        className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium
                          ${car.statut && car.statut.toLowerCase() === "disponible"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                          }`
                        }
                      >
                        {car.statut}
                      </div>
                    </div>

                    <div className="p-4">
                      <h2 className="text-xl font-bold text-gray-800 mb-2">
                        {car.marque} {car.model}
                      </h2>
                      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Année:</span>
                          <span className="font-medium">{car.year}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Km:</span>
                          <span className="font-medium">
                            {car.km?.toLocaleString()} km
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Énergie:</span>
                          <span className="font-medium">{car.Energie}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Boîte:</span>
                          <span className="font-medium">{car.Boite}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-blue-600">
                          {car.price?.toLocaleString()} TND
                        </span>
                        <button 
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/carDetaille/${car._id}`);
                          }}
                        >
                          <span>Voir détails</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
