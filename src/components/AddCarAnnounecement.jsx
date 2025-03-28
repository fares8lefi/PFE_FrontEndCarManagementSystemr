import { React, useState } from "react";
import { addCarImages } from "../services/ApiCar";

export default function AddCarAnnounecement() {
  const [carData, setCarData] = useState({
    marque: "",
    model: "",
    year: "",
    km: "",
    price: "",
    Puissance: "",
    Energie: "Essence",
    Boite: "Manuelle",
    Position: "",
    description: "",
  });
  
  const [images, setImages] = useState([]);
  const [qrCode, setQrCode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files)); // Convertir FileList en tableau
  };
  
  const SubmitAnounnce = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Vous êtes non connecté");
      return;
    }
  
    try {
      const submitCarData = new FormData();
  
      // Ajouter les données de la voiture
      Object.keys(carData).forEach((key) => {
        submitCarData.append(key, carData[key]);
      });
  
      // Ajouter les images
      images.forEach((file) => {
        submitCarData.append("images", file);
      });
  
      const response = await addCarImages(submitCarData);
  
      if (response.data) {
        alert("Annonce publiée!");
        setQrCode(response.data.qrCode);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de publié de l'annonce.");
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="w-full min-w-xl">
      <p className="text-xl text-center mt-24 font-bold mb-8">
        Best deals ? Create your announcement here
      </p>
      <form
        onSubmit={SubmitAnounnce}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4"
      >
        {/* Colonne 1 */}
        <div className="space-y-6">
          <input
            type="text"
            name="marque"
            value={carData.marque}
            onChange={handleChange}
            placeholder="Marque"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            name="model"
            value={carData.model}
            onChange={handleChange}
            placeholder="Model"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="number"
            name="year"
            value={carData.year}
            onChange={handleChange}
            placeholder="Année"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            min="1900"
            max={new Date().getFullYear()}
            required
          />
          <input
            type="number"
            name="km"
            value={carData.km}
            onChange={handleChange}
            placeholder="Kilométrage"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            min="0"
            required
          />
        </div>
        {/* Colonne 2 */}
        <div className="space-y-6">
          <input
            type="number"
            name="price"
            value={carData.price}
            onChange={handleChange}
            placeholder="Prix (€)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            min="0"
            required
          />
          <input
            type="number"
            name="Puissance"
            value={carData.Puissance}
            onChange={handleChange}
            placeholder="Puissance (ch)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            min="0"
            required
          />
          <select
            name="Energie"
            value={carData.Energie}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="Essence">Essence</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybride</option>
            <option value="Electric">Électrique</option>
          </select>
          <select
            name="Boite"
            value={carData.Boite}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="Manuelle">Manuelle</option>
            <option value="Auto">Automatique</option>
          </select>
        </div>
        {/* Colonne 3 */}
        <div className="space-y-6">
          <input
            type="text"
            name="Position"
            value={carData.Position}
            onChange={handleChange}
            placeholder="Localisation"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
          <textarea
            name="description"
            value={carData.description}
            onChange={handleChange}
            placeholder="Description détaillée"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-6 rounded-lg"
          >
            Publier l'annonce
          </button>
        </div>
      </form>
      {/*boite de dialogue est afichage de qr code */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div>
          <div className="relative bg-white rounded-lg p-6 z-10 max-w-xs w-full text-center">
            <h2 className="text-lg font-bold mb-4">QR Code de l'annonce</h2>
            {qrCode ? (
              <img src={qrCode} alt="QR Code de l'annonce" className="mx-auto" />
            ) : (
              <p>Aucun QR code généré</p>
            )}
            <button
              onClick={closeModal}
              className="mt-4 bg-blue-600 text-white py-1 px-3 rounded"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
