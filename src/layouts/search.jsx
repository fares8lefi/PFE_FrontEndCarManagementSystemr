import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import FilterSidebar from "../components/FilterSidebar";
import { PropagateLoader } from "react-spinners";
import { getCarsFiltered, getCarsByMarque } from "../services/ApiCar";
import { GiCarKey } from "react-icons/gi";

export default function Search() {
  const location = useLocation();
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  
    const searchParams = new URLSearchParams(location.search);
    const marque = searchParams.get("marque");

    const getCars = async () => {
      try {
        let response;
        if (Object.keys(filters).length === 0) {
          // Recherche  par marque (recherche intiale)
          response = await getCarsByMarque(marque);
        } else {
          //  rechercher avec les filtres filtres
          response = await getCarsFiltered({ marque, ...filters });
        }

        if (response.data.cars) {
          setCars(response.data.cars);
        }
      } catch (err) {
        setError(err.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };
    useEffect(() => {
    getCars();
  }, [location.search, filters]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1 mt-16">
        <FilterSidebar onFilterChange={setFilters} />

        <div className="ml-64 p-8 flex-1">
          <h1 className="text-3xl font-bold mb-8 border-b pb-4">
            Résultats pour "{new URLSearchParams(location.search).get("marque")}
            "
          </h1>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <PropagateLoader color="#3B82F6" size={15} />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center text-xl">{error}</div>
          ) : cars.length === 0 ? (
            <div className="text-center py-12">
              <GiCarKey className="mx-auto text-6xl text-gray-400 mb-4" />
              <p className="text-gray-500 text-xl">
                aucun véhicule touvé 
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <div
                  key={car._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-64">
                    {car.cars_images?.length > 0 ? (
                      <img
                        src={`data:image/png;base64,${car.cars_images[0].data}`}
                        alt={`${car.marque} ${car.model}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <GiCarKey className="text-4xl text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">
                      {car.marque} {car.model}
                    </h2>
                    <p className="text-2xl font-bold text-blue-600 mb-4">
                      {car.price?.toLocaleString("fr-FR")} €
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-semibold">Année:</span> {car.year}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Kilométrage:</span>{" "}
                        {car.km?.toLocaleString("fr-FR")} km
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Énergie:</span>{" "}
                        {car.Energie}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
