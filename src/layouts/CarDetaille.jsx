import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCarById } from "../services/ApiCar";

export default function CarDetaille() {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    const CarDetails = async () => {
      try {
        const response = await getCarById(id);
        setCar(response.data || null);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails :", error);
      }
    };
    if (id) CarDetails();
  }, [id]);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      {/* Conteneur principal en full width */}
      <div className="w-full bg-white shadow-xl rounded-2xl p-8">
        {/* Galerie d'images scrollable */}
        <div className="mb-8 overflow-x-auto pb-4 whitespace-nowrap scrollbar-hide">
          <div className="flex space-x-4 w-max px-4">
            {car?.cars_images?.map((img, index) => (
              <div 
                key={index}
                className="relative flex-shrink-0 w-96 h-64 rounded-xl overflow-hidden shadow-lg"
              >
                <img
                  src={img}
                  alt={`${car.marque} ${car.model} - ${index + 1}`}
                  className="w-full h-full object-cover transform hover:scale-110 transition duration-300"
                />
              </div>
            ))}
          </div>
          {car?.cars_images?.length === 0 && (
            <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded-xl">
              <span className="text-gray-400 text-xl">Aucune image disponible</span>
            </div>
          )}
        </div>

        {/* Détails de la voiture */}
        <div className="px-8 pb-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <h1 className="text-4xl font-bold text-gray-900">
              {car?.marque} {car?.model}
            </h1>
            <p className="text-3xl font-bold text-blue-600">
              {car?.price?.toLocaleString('fr-FR') 
                ? `${car.price.toLocaleString('fr-FR')} DT`
                : "Prix négociable"}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xl text-gray-600">
            {car?.year && <span className="bg-gray-100 px-4 py-2 rounded-full">🏷️ {car.year}</span>}
            {car?.fuelType && <span className="bg-gray-100 px-4 py-2 rounded-full">⛽ {car.fuelType}</span>}
            {car?.transmission && <span className="bg-gray-100 px-4 py-2 rounded-full">⚙️ {car.transmission}</span>}
            {car?.statut && <span className="bg-green-100 px-4 py-2 rounded-full text-green-800">✔️ {car.statut}</span>}
          </div>

          {car?.description && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-semibold mb-4">Description</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {car.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
