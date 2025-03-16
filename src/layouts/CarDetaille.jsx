import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCarById } from "../services/ApiCar";

export default function CarDetaille() {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await getCarById(id);
        if (response.data) {
          setCar(response.data);
        } else {
          console.error("Aucune voiture trouvée avec cet ID.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de la voiture :", error);
      }
    };

    if (id) fetchCarDetails();
  }, [id]);

  if (!car) {
    return <p className="text-center text-gray-500">Chargement des détails...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className="mb-4">
        {car?.cars_images?.length > 0 ? (
          <img
            src={car.cars_images[0]}
            alt={`Image de ${car.marque || "Voiture"} ${car.model || ""}`}
            className="w-full h-64 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">Image Placeholder</span>
          </div>
        )}
      </div>
      <h2 className="text-2xl font-bold">{car.marque || "Marque inconnue"}</h2>
      <p className="text-gray-600">{car.model || "Modèle inconnu"}</p>
      <div className="grid grid-cols-2 gap-4 mt-4 text-gray-700">
        <p><strong>🛢️ Carburant:</strong> {car.fuelType || "Non spécifié"}</p>
        <p><strong>⚙️ Statut:</strong> {car.statut || "Disponible"}</p>
        <p><strong>📅 Année:</strong> {car.year || "Non spécifié"}</p>
        <p><strong>🎮 Transmission:</strong> {car.transmission || "Manuelle"}</p>
      </div>
      <div className="flex justify-between items-center mt-6">
        <p className="text-red-600 font-bold text-2xl">
          ${car.price?.toLocaleString() || "Prix inconnu"}
        </p>
        <p className="text-gray-600 flex items-center gap-1">
          <span>⭐</span> {car.reviews || "0"} Avis
        </p>
      </div>
    </div>
  );
}
