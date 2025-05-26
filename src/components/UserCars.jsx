import React, { useEffect, useState } from "react";
import { getUserCars, deleteCarByID, UpdateCarById, updateCarStatus } from "../services/ApiCar";
import { Delete, Edit, CheckCircle, QrCode2 } from "@mui/icons-material";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
//import { TbAutomaticGearboxFilled } from "react-icons/tb";
import { TbAdjustmentsAlt } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { PropagateLoader } from 'react-spinners';
import { GiGasPump, GiCarKey } from 'react-icons/gi';
import { MdOutlineElectricalServices, MdDateRange } from 'react-icons/md';
import { TbManualGearbox } from 'react-icons/tb';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { getCarQRCode } from "../services/ApiQrCode";
import { toast } from 'react-toastify';

export default function UserCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModal, setEditModal] = useState({
    isOpen: false,
    car: null,
  });
  const [qrCodeModal, setQrCodeModal] = useState({
    isOpen: false,
    qrCode: null,
    carInfo: null
  });
  const [processing, setProcessing] = useState({});

  const getCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getUserCars();
      if (res?.data?.cars) {
        setCars(res.data.cars);
      } else {
        setCars([]);
        console.warn('No cars data received from API');
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
      setError('Failed to load cars. Please try again later.');
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir modal d'édition
  const openEdit = (car) => {
    setEditModal({
      isOpen: true,
      car,
      formData: {
        marque: car.marque,
        model: car.model,
        year: car.year,
        price: car.price,
        Energie: car.Energie,
        Boite: car.Boite,
        km: car.km,
      },
    });
  };

  
  const submitModification = async (e) => {
    e.preventDefault();
    try {
      await UpdateCarById(editModal.car._id, editModal.formData);
      getCars();
      setEditModal({ isOpen: false, car: null });
    } catch (error) {
      console.error(error);
    }
  };

  // Mettre à jour le formulaire
  const handleChange = (e) => {
    setEditModal((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [e.target.name]: e.target.value,
      },
    }));
  };
  const navigate = useNavigate();
  const handleAddCarAnnounecement = () => navigate("/addCarAnnounecement");
  const handleDeleteCar = async (carId) => {
    try {
      await deleteCarByID(carId);
      await getCars(); // Rafraîchit la liste après suppression
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowQRCode = async (car) => {
    try {
      const response = await getCarQRCode(car._id);
      setQrCodeModal({
        isOpen: true,
        qrCode: response.data.qrCode,
        carInfo: car
      });
      console.log("QR Code récupéré avec succès");
    } catch (error) {
      toast.error("Erreur lors de la récupération du QR code");
      console.error(error);
    }
  };

  const handleUpdateCarStatus = async (carId, currentStatus) => {
    try {
      setProcessing(prev => ({ ...prev, [carId]: true }));
      await updateCarStatus(carId, !currentStatus);
      toast.success(currentStatus ? "Véhicule marqué comme disponible" : "Véhicule marqué comme vendu");
      await getCars(); // Rafraîchir la liste
    } catch (error) {
      console.error('Error updating car status:', error);
      toast.error("Erreur lors de la mise à jour du statut");
    } finally {
      setProcessing(prev => ({ ...prev, [carId]: false }));
    }
  };

  useEffect(() => {
    getCars();
    AOS.init({
      duration: 1000,
      once: true
    });
    return () => AOS.refresh();
  }, []);
  
  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={getCars}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Titre et description */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gérez vos véhicules</h1>
        <p className="text-gray-600">Suivez et gérez facilement toutes vos annonces de voitures en un seul endroit</p>
      </div>

      {/*formulaire de modification */}
      {editModal.isOpen && (
        <div
          className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setEditModal({ isOpen: false, car: null })}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              Modifier {editModal.car?.marque}
            </h2>
            <form onSubmit={submitModification}>
              <div className="space-y-4">
                {Object.entries(editModal.formData).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium capitalize mb-1 text-gray-700">
                      {key}
                    </label>
                    <input
                      type={typeof value === "number" ? "number" : "text"}
                      name={key}
                      value={value}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModal({ isOpen: false, car: null })}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
       <div className="mb-6 flex justify-end">
        <button
          onClick={handleAddCarAnnounecement}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <span>+</span>
          Ajouter une annonce
        </button>
      </div>
      {/* Modal QR Code */}
      {qrCodeModal.isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setQrCodeModal({ isOpen: false, qrCode: null, carInfo: null })}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              QR Code - {qrCodeModal.carInfo?.marque} {qrCodeModal.carInfo?.model}
            </h2>
            <div className="flex flex-col items-center">
              <img
                src={qrCodeModal.qrCode}
                alt="QR Code"
                className="w-64 h-64 mb-4"
              />
              <p className="text-gray-600 text-sm mb-4">
                Scannez ce QR code pour accéder aux détails de la voiture
              </p>
              <button
                onClick={() => setQrCodeModal({ isOpen: false, qrCode: null, carInfo: null })}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      {/* liste des voitures */}
      {loading ? (
        <div className="flex justify-center py-12">
          <PropagateLoader 
            color="#3B82F6"
            size={15}
            speedMultiplier={0.8}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {!cars || cars.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-xl">Aucune voiture trouvée</p>
            </div>
          ) : (
            cars.map((car) => (
              <div 
                key={car._id} 
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                data-aos="fade-up"
              >
                {/* Image en haut */}
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden shadow-inner mb-4">
                  {car.cars_images ? (
                    <img
                      src={car.cars_images}
                      alt={car.marque}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50">
                      Aucune image
                    </div>
                  )}
                </div>

                {/* Contenu principal */}
                <div className="flex justify-between items-start">
                  {/* Informations à gauche */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {car.marque} {car.model}
                    </h3>
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
                        <AttachMoneyIcon fontSize="small" className="mr-2" />
                        {car.price} TND
                      </div>
                    </div>
                  </div>

                  {/* Actions à droite */}
                  <div className="flex flex-col gap-3 ml-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(car)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors duration-300"
                      >
                        <Edit fontSize="small" />
                      </button>
                      <button
                        onClick={() => handleDeleteCar(car._id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors duration-300"
                      >
                        <Delete fontSize="small" />
                      </button>
                      <button
                        onClick={() => handleShowQRCode(car)}
                        className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-50 transition-colors duration-300"
                      >
                        <QrCode2 fontSize="small" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleUpdateCarStatus(car._id, car.isSold)}
                      disabled={processing[car._id]}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-medium shadow-sm ${
                        car.isSold 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      } ${processing[car._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {processing[car._id] ? (
                        <PropagateLoader color={car.isSold ? "#ffffff" : "#15803d"} size={8} />
                      ) : (
                        <>
                          <CheckCircle fontSize="small" />
                          {car.isSold ? 'Vendu' : 'Marquer comme vendu'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
