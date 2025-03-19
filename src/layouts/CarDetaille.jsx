import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCarById } from "../services/ApiCar";
import CarPlusDetaille from "../components/CarPlusDetaille";
export default function CarDetaille() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0); // L'image sélectionnée
  const [isOpen, setIsOpen] = useState(false);           // Pour ouvrir la modale

  // Récupération des détails de la voiture
  const CarDetails = async () => {
    try {
      const response = await getCarById(id);
      setCar(response.data || null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      CarDetails();
    }
  }, [id]);

  if (!car) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-8">
        <div className="w-full bg-white shadow-xl rounded-2xl p-8">
          <div className="text-center text-xl text-gray-500">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      <div className="w-full bg-white shadow-xl rounded-2xl p-8">

        {/* --- Image principale --- */}
        <div className="mb-8">
          <div className="relative w-full h-96 flex items-center justify-center bg-gray-200 rounded-xl overflow-hidden">
            <img
              src={car.cars_images[selectedIndex]}      // On affiche l'image sélectionnée
              alt={`Car ${selectedIndex + 1}`}
              className="object-contain h-full w-auto cursor-pointer"
              onClick={() => setIsOpen(true)}           // Ouvre la modale au clic
            />
          </div>

          
          <div className="flex space-x-4 mt-4 overflow-x-auto pb-4 whitespace-nowrap scrollbar-hide">
            {car.cars_images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`w-24 h-24 object-cover rounded-lg cursor-pointer transition-transform duration-300 ${
                  index === selectedIndex ? "scale-105 border-2 border-blue-500" : ""
                }`}
                onClick={() => setSelectedIndex(index)}  // Met à jour l'image principale
              />
            ))}
          </div>
        </div>

        {/* --- Modale d’agrandissement --- */}
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="relative">
              <img
                src={car.cars_images[selectedIndex]}
                alt={`Full screen Car ${selectedIndex + 1}`}
                className="max-w-[90vw] max-h-[90vh] object-contain"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-white text-3xl font-bold"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {/*car detaille  */ }
        <div className="px-8 pb-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <h1 className="text-4xl font-bold text-gray-900">
              {car.marque} {car.model}
            </h1>
            <p className="text-3xl font-bold text-blue-600">
              `${car.price}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xl text-gray-600">
            <span className="bg-gray-100 px-4 py-2 rounded-full">
              🏷️ {car.year}
            </span>
            <span className="bg-gray-100 px-4 py-2 rounded-full">
              ⛽ {car.fuel}
            </span>
            <span className="bg-gray-100 px-4 py-2 rounded-full">
              ⚙️ {car.transmission}
            </span>
            <span className="bg-green-100 px-4 py-2 rounded-full text-green-800">
              ✔️ {car.statut}
            </span>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-semibold mb-4">Description</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              {car.description}
            </p>
          </div>
        </div>
      </div>
      <CarPlusDetaille/>
    </div>
   
  );
}
