import React, { useEffect, useState } from "react";
import { getUserCars, deleteCarByID, UpdateCarById } from "../services/ApiCar";
import { Delete, Edit } from "@mui/icons-material";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
//import { TbAutomaticGearboxFilled } from "react-icons/tb";
import { TbAdjustmentsAlt } from "react-icons/tb";


export default function UserCars() {
  const [cars, setCars] = useState([]);
  const [editModal, setEditModal] = useState({
    isOpen: false,
    car: null,
  });

  
  const getCars = async () => {
    try {
      const res = await getUserCars();
      setCars(res.data.cars);
    } catch (error) {
      console.error(error);
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

  useEffect(() => {
    getCars();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/*formulaire de modification */}
      {editModal.isOpen && (
        <div
          className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center"
          onClick={() => setEditModal({ isOpen: false, car: null })}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              Modifier {editModal.car?.marque}
            </h2>
            <form onSubmit={submitModification}>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(editModal.formData).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <label className="block text-sm font-medium capitalize">
                      {key}
                    </label>
                    <input
                      type={typeof value === "number" ? "number" : "text"}
                      name={key}
                      value={value}
                      onChange={handleChange}
                      className="mt-1 p-2 border rounded w-full"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModal({ isOpen: false, car: null })}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* liste des voitures */}
      <div className="space-y-4">
        {cars.map((car) => (
          <div key={car._id} className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex gap-4">
              {/* Image */}
              <div className="w-1/3 bg-gray-100 rounded-lg overflow-hidden">
                {car.cars_images ? (
                  <img
                    src={car.cars_images}
                    alt={car.marque}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="h-32 flex items-center justify-center text-gray-400">
                    Aucune image
                  </div>
                )}
              </div>

              {/* Détails */}
              <div className="w-2/3">
                <h3 className="text-xl font-bold">
                  {car.marque} {car.model}
                </h3>
                <p className="text-gray-600"><CalendarMonthIcon fontSize="small" /> {car.year}</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <div className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm">
                    <span className="mr-1">
                      <ElectricBoltIcon fontSize="small" />
                    </span>
                    {car.Energie}
                  </div>
                  <div className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm">
                    <span className="mr-1">
                      <AttachMoneyIcon fontSize="small" />
                    </span>
                    {car.price}
                  </div>
                  <div className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm">
                    <span className="mr-1">
                      <TbAdjustmentsAlt fontSize="small" />
                    </span>
                    {car.Boite}
                  </div>
                  

                  {/*
                                    <Badge label={car.Boite} icon="⚙️" />
                                    */}
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => openEdit(car)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit fontSize="small" />
                  </button>
                  <button
                    onClick={() => deleteCarByID(car._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Delete fontSize="small" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
