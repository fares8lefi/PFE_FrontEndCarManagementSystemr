import React, { useState, useEffect } from "react";
import { getAllCars, deleteCarByID, UpdateCarById } from "../../services/ApiCar";
import { toast } from "react-toastify";
import { FaCar, FaTrash, FaSpinner, FaEdit } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const CarManagement = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editModal, setEditModal] = useState({
    isOpen: false,
    car: null,
    formData: {
      marque: "",
      model: "",
      year: "",
      price: "",
      energie: "Essence",
      boite: "Manuelle",
      km: "",
    }
  });

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await getAllCars();
      setCars(response.data?.cars || []);
    } catch (error) {
      toast.error("Erreur lors du chargement des voitures");
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (carId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette voiture ?")) {
      try {
        setDeletingId(carId);
        await deleteCarByID(carId);
        toast.success("Voiture supprimée avec succès");
        setCars(prev => prev.filter(car => car._id !== carId));
      } catch (error) {
        toast.error(error.message || "Erreur lors de la suppression");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const openEditModal = (car) => {
    setEditModal({
      isOpen: true,
      car,
      formData: {
        marque: car.marque,
        model: car.model,
        year: car.year,
        price: car.price,
        energie: car.energie,
        boite: car.boite,
        km: car.km,
      },
    });
  };

  const handleFormChange = (e) => {
    setEditModal(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [e.target.name]: e.target.value
      }
    }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await UpdateCarById(editModal.car._id, editModal.formData);
      toast.success("Voiture mise à jour avec succès");
      fetchCars();
      setEditModal({ isOpen: false, car: null, formData: {} });
    } catch (error) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Modal d'édition */}
        {editModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-2xl font-bold mb-4">Modifier la voiture</h2>
              <form onSubmit={handleSubmitEdit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Marque</label>
                  <input
                    type="text"
                    name="marque"
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={editModal.formData.marque}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Modèle</label>
                  <input
                    type="text"
                    name="model"
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={editModal.formData.model}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Année</label>
                  <input
                    type="number"
                    name="year"
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={editModal.formData.year}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Prix (DT)</label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={editModal.formData.price}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Kilométrage</label>
                  <input
                    type="number"
                    name="km"
                    min="0"
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={editModal.formData.km}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Énergie</label>
                  <select
                    name="energie"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={editModal.formData.energie}
                    onChange={handleFormChange}
                  >
                    <option value="Essence">Essence</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electrique">Électrique</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Boîte de vitesse</label>
                  <select
                    name="boite"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={editModal.formData.boite}
                    onChange={handleFormChange}
                  >
                    <option value="Manuelle">Manuelle</option>
                    <option value="Automatique">Automatique</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setEditModal({ isOpen: false, car: null, formData: {} })}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Contenu principal */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Gestion des Voitures</h1>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marque</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modèle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Année</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix (DT)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Énergie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cars?.length > 0 ? (
                  cars.map((car) => (
                    <tr key={car._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
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
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{car.model}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{car.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{car.price?.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {car.energie}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(car)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Modifier"
                          >
                            <FaEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDelete(car._id)}
                            disabled={deletingId === car._id}
                            className={`text-red-600 hover:text-red-800 p-1 ${
                              deletingId === car._id ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            title="Supprimer"
                          >
                            {deletingId === car._id ? (
                              <FaSpinner className="animate-spin text-lg" />
                            ) : (
                              <FaTrash className="text-lg" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Aucune voiture trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarManagement;