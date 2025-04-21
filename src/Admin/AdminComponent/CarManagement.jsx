import React, { useState, useEffect } from "react";
import {
  getAllCars,
  deleteCarByID,
  UpdateCarById,
} from "../../services/ApiCar";
import { toast } from "react-toastify";
import {
  FaCar,
  FaTrash,
  FaSpinner,
  FaEdit,
  FaSearch,
  FaPlus,
  FaUserPlus,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { PropagateLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { FaCarSide } from "react-icons/fa";

const CarManagement = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editModal, setEditModal] = useState({
    isOpen: false,
    car: null,
    formData: {},
  });

  const navigate = useNavigate();

  const getCars = async () => {
    setLoading(true);
    try {
      const response = await getAllCars();
      setCars(response.data?.cars || []);
    } catch (error) {
      toast.error("Erreur lors du chargement des voitures");
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (carId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette voiture ?"))
      return;
    setDeletingId(carId);
    try {
      await deleteCarByID(carId);
      toast.success("Voiture supprimée avec succès");
      getCars();
    } catch (error) {
      toast.error(error.message || "Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (car) => {
    setEditModal({
      isOpen: true,
      car,
      formData: { ...car },
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditModal((prev) => ({
      ...prev,
      formData: { ...prev.formData, [name]: value },
    }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await UpdateCarById(editModal.car._id, editModal.formData);
      toast.success("Voiture mise à jour avec succès");
      getCars();
      setEditModal({ isOpen: false, car: null, formData: {} });
    } catch (error) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  const handleSearch = (term) => {};

  const handleCreateClick = () => {
    navigate("/admin/create-car");
  };

  useEffect(() => {
    getCars();
  }, []);

  const filteredCars = cars.filter(
    (car) =>
      car.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (car.username || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PropagateLoader color="#3B82F6" size={15} />
      </div>
    );
  }

  return (
    <div className="mr-4 p-6 bg-gray-50 mt-10 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Gestion des Voitures
        </h1>

        <div className="flex gap-2 w-full md:w-auto">
          {/* Input avec icône de recherche */}
          <div className="relative flex-grow">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Bouton "Créer un compte" */}
          <button
            onClick={() => navigate("/admin/create-user")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <FaCarSide />
            <span>Ajouté Une Voiture</span>
          </button>
        </div>
      </div>

      {/* Tableau des voitures */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modèle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Année
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <tr key={car._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap flex items-center">
                      {car.cars_images ? (
                        <img
                          src={car.cars_images}
                          alt={car.marque}
                          className="h-12 w-12 object-cover rounded mr-2"
                        />
                      ) : (
                        <FaCar className="text-gray-500 mr-2" />
                      )}
                      {car.marque}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{car.model}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{car.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {car.username || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                      <button
                        onClick={() => openEditModal(car)}
                        title="Modifier"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteCar(car._id)}
                        disabled={deletingId === car._id}
                        title="Supprimer"
                        className={`${
                          deletingId === car._id
                            ? "opacity-50 cursor-not-allowed"
                            : "text-red-600 hover:text-red-800"
                        }`}
                      >
                        {deletingId === car._id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaTrash />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    Aucune voiture trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CarManagement;
