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
      const filtereByMarque = { ...filters, marque };

      if (Object.keys(filters).length === 0) {
        response = await getCarsByMarque(marque);
        console.log(response.data)
      } else {
        response = await getCarsFiltered(filtereByMarque);
      }

      if (response.data.cars) {
        setCars(response.data.cars);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de chargement");
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
                <p className="text-gray-500 text-xl">
                  Aucun véhicule trouvé pour la marque <strong>"{marque}"</strong>
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Essayez avec une autre marque ou modifiez vos filtres.
                </p>
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
