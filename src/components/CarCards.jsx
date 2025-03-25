import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCars } from "../services/ApiCar";

export default function CarCards() {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  const getCars = async () => {
    try {
      const res = await getAllCars(); // Appel API car
     
        setCars(res.data.cars); 
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCars();
  }, []);

  const handleCarClick = (id) => {
    const logged = localStorage.getItem('authToken');
  
    if (!id) return;
  
    if (logged) {
      navigate(`/carDetaille/${id}`);
    } else { 
      navigate('/login', { 
        state: { 
          from: `/carDetaille/${id}`, 
          message: "Veuillez vous connecter pour accéder aux détails du véhicule" 
        } 
      });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-24 mt-6">
      {cars.length === 0 ? (
        <p className="col-span-full text-center">Aucune voiture trouvée.</p>
      ) : (
        cars.map((car) => (
          <div
            key={car._id}
            className="rounded-xl overflow-hidden shadow-lg border p-4 bg-white cursor-pointer"
            onClick={() => handleCarClick(car._id)}
          >
            <div className="bg-gray-300 h-40 w-full flex items-center justify-center">
              {car?.cars_images ? (
                <img
                  src={car.cars_images} 
                  alt={`Image de ${car.marque || "Voiture"} ${car.model || ""}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-500">Image Placeholder</span>
              )}
            </div>
            <div className="py-4">
              <p className="text-sm text-gray-500">
                {car.model}
              </p>
              <h2 className="text-xl font-bold">
                {car.marque}
              </h2>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-700">
                <p className="flex items-center gap-1">
                  <span>🛢️</span> {car.fuelType }
                </p>
                <p className="flex items-center gap-1">
                  <span>
                  <img
                  src="../public/statut.png"
                  alt="Tik Tok icon"
                  className="w-4 h-4 fill-current text-white"
                />
                  </span> {car.statut}
                </p>
                <p className="flex items-center gap-1">
                  <span> <img
                  src="../public/calendrier.png"
                  alt="Tik Tok icon"
                  className="w-4 h-4 fill-current text-white"
                /></span> {car.year }
                </p>
                <p className="flex items-center gap-1">
                  <span>
                  <img
                  src="../public/transmission.png"
                  alt="Tik Tok icon"
                  className="w-4 h-4 fill-current text-white"
                />  
                  </span> {car.transmission}
                </p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-red-600 font-bold text-lg">
                  ${car.price}
                </p>
                <p className="text-gray-600 flex items-center gap-1">
                  <span>⭐</span> {car.reviews } {/*la fonction d'ajoue aux favoris ici*/}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
