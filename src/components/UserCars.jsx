import React, { useEffect, useState } from "react";
import { getUserCars, deleteCarByID, UpdateCarById } from "../services/ApiCar";
import { Delete, Edit, CheckCircle } from "@mui/icons-material";
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

export default function UserCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({
    isOpen: false,
    car: null,
  });

  
  const getCars = async () => {
    try {
      setLoading(true);
      const res = await getUserCars();
      setCars(res.data.cars);
    } catch (error) {
      console.error(error);
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
  useEffect(() => {
    getCars();
    AOS.init({
      duration: 1000,
      once: true
    });
    return () => AOS.refresh();
  }, []);
  
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
          {cars.length === 0 ? (
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
                    </div>
                    <button
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-medium shadow-sm ${
                        car.isSold 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      <CheckCircle fontSize="small" />
                      {car.isSold ? 'Vendu' : 'Marquer comme vendu'}
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
