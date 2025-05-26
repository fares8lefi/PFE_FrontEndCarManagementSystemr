import { React, useState } from "react";
import { addCarImages } from "../services/ApiCar";
import { blurCarPlate, detectCarInImage } from "../services/ApiAI";
import Navbar from "./Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCar, FaImage, FaMapMarkerAlt, FaDownload, FaShare, FaTimes, FaEuroSign, FaCogs, FaGasPump, FaCarSide, FaUserTie, FaHandshake, FaCertificate, FaSearch, FaArrowDown, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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
    phone: "",
  });
  const [images, setImages] = useState([]);
  const [qrCode, setQrCode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
      toast.error("Vous devez être connecté pour publier une annonce");
      return;
    }

    try {
      setIsSubmitting(true);

      // Vérification IA sur chaque image
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        try {
          const result = await detectCarInImage(file);
          
          if (!result.hasCar) {
            toast.error(`L'image ${file.name} ne contient pas de voiture. Veuillez choisir une image valide.`);
            setIsSubmitting(false);
            return;
          }
          
          console.log(`Image ${i + 1} - Détection réussie:`, {
            détails: result.details,
            confiance: `${(result.confidence * 100).toFixed(1)}%`
          });
        } catch (error) {
          console.error(`Erreur lors de la détection de l'image ${i + 1}:`, error);
          toast.error(`Erreur lors de l'analyse de l'image ${i + 1}`);
          setIsSubmitting(false);
          return;
        }
      }

      // Appliquer le blur sur chaque image
      const blurredImages = [];
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        try {
          const blurredBlob = await blurCarPlate(file);
          const blurredFile = new File([blurredBlob], file.name, { type: blurredBlob.type });
          blurredImages.push(blurredFile);
          console.log(`Image ${i + 1} - Plaque floutée avec succès`);
        } catch (error) {
          console.error(`Erreur lors du floutage de l'image ${i + 1}:`, error);
          toast.error(`Erreur lors du traitement de l'image ${i + 1}`);
          setIsSubmitting(false);
          return;
        }
      }

      // Préparation des données pour l'envoi
      const submitCarData = new FormData();
      Object.keys(carData).forEach((key) => {
        submitCarData.append(key, carData[key]);
      });
      blurredImages.forEach((file) => {
        submitCarData.append("images", file);
      });

      // Envoi des données
      const response = await addCarImages(submitCarData);

      if (response.data) {
        toast.success("Annonce publiée avec succès!");
        setQrCode(response.data.qrCode);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Erreur lors de la publication:", error);
      toast.error("Erreur lors de la publication de l'annonce");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const downloadQRCode = () => {
    
  };

  const shareQRCode = () => {
    
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12 mt-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
            Publier une annonce
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Remplissez les informations ci-dessous pour créer votre annonce
          </p>

          <form onSubmit={SubmitAnounnce} className="space-y-8">
            {/* Section Information Principale */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Colonne 1 - Informations de base */}
              <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-blue-600 mb-4">
                  <FaCar className="text-2xl" />
                  <h2 className="text-xl font-semibold">Informations de base</h2>
                </div>

                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                    <input
                      type="text"
                      name="marque"
                      value={carData.marque}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-blue-400"
                      required
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                    <input
                      type="text"
                      name="model"
                      value={carData.model}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-blue-400"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                      <input
                        type="number"
                        name="year"
                        value={carData.year}
                        onChange={handleChange}
                        min="1900"
                        max={new Date().getFullYear()}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-blue-400"
                        required
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kilométrage</label>
                      <input
                        type="number"
                        name="km"
                        value={carData.km}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-blue-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-blue-600" />
                        Numéro de téléphone
                      </div>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={carData.phone}
                      onChange={handleChange}
                      placeholder="Ex: 2X XXX XXX"
                      maxLength="8"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-blue-400"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Format: 8 chiffres (commence par 2, 4, 5, 7 ou 9)
                    </p>
                  </div>
                </div>
              </div>

              {/* Colonne 2 - Caractéristiques techniques */}
              <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-green-600 mb-4">
                  <FaCogs className="text-2xl" />
                  <h2 className="text-xl font-semibold">Caractéristiques</h2>
                </div>

                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center gap-2">
                        <FaEuroSign className="text-green-600" />
                        Prix
                      </div>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={carData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-green-400"
                      required
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Puissance (ch)</label>
                    <input
                      type="number"
                      name="Puissance"
                      value={carData.Puissance}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-green-400"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <div className="flex items-center gap-2">
                          <FaGasPump className="text-green-600" />
                          Énergie
                        </div>
                      </label>
                      <select
                        name="Energie"
                        value={carData.Energie}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-green-400"
                        required
                      >
                        <option value="Essence">Essence</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybrid">Hybride</option>
                        <option value="Electric">Électrique</option>
                      </select>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Boîte</label>
                      <select
                        name="Boite"
                        value={carData.Boite}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-green-400"
                        required
                      >
                        <option value="Manuelle">Manuelle</option>
                        <option value="Auto">Automatique</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne 3 - Photos et Description */}
              <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-purple-600 mb-4">
                  <FaImage className="text-2xl" />
                  <h2 className="text-xl font-semibold">Photos et Description</h2>
                </div>

                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-purple-600" />
                        Localisation
                      </div>
                    </label>
                    <input
                      type="text"
                      name="Position"
                      value={carData.Position}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 group-hover:border-purple-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Photos du véhicule</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                    {images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {images.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Image ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                              <FaTimes className="text-white text-xl cursor-pointer" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={carData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 group-hover:border-purple-400 h-32 resize-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton de soumission */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  bg-gradient-to-r from-blue-600 to-blue-700
                  text-white py-4 px-8 rounded-xl
                  flex items-center gap-3 text-lg font-semibold
                  shadow-lg hover:shadow-xl
                  transition-all duration-300 transform hover:scale-105
                  ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:from-blue-700 hover:to-blue-800'}
                `}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publication en cours...
                  </>
                ) : (
                  <>
                    <FaCar />
                    Publier l'annonce
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal QR Code modifié */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full m-4 transform transition-all duration-300">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              QR Code de votre annonce
            </h2>
            {qrCode ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-b from-gray-50 to-white p-6 rounded-xl shadow-inner">
                  <img
                    src={qrCode}
                    alt="QR Code de l'annonce"
                    className="mx-auto w-64 h-64"
                  />
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={downloadQRCode}
                    className="flex items-center gap-2 bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <FaDownload /> Télécharger
                  </button>
                  <button
                    onClick={shareQRCode}
                    className="flex items-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <FaShare /> Partager
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="animate-spin mx-auto h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <p className="mt-4 text-gray-600">Génération du QR code...</p>
              </div>
            )}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors transform hover:scale-110 transition-all duration-300"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
