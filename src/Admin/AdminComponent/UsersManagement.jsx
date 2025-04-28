import React, { useState, useEffect } from 'react';
import {
  FaUserEdit,
  FaTrash,
  FaLock,
  FaUnlock,
  FaSearch,
  FaUserShield,
  FaUser,
  FaSpinner,
  FaUserPlus // Ajout de l'icône pour la création
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { PropagateLoader } from 'react-spinners';
import { getAllUsers, searchUsers, updateUserStatus, deleteUser} from '../../services/ApiUser'; // Ajoutez createUser
import { debounce } from './debounce';
import { useNavigate } from "react-router-dom";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editForm, setEditForm] = useState({
    _id: '',
    username: '',
    email: '',
    role: '',
    status: 'active'
  });
  const [isCreating, setIsCreating] = useState(false); // État pour gérer la création
  const navigate = useNavigate();

  const fetchUsers = async (searchQuery = '') => {
    setLoading(true);
    try {
      const response = searchQuery
        ? await searchUsers(searchQuery)
        : await getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur de chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = debounce((value) => {
    if (value) fetchUsers(value);
    else fetchUsers();
  }, 500);

  const handleStatusToggle = async (userId, currentStatus) => {
    setUpdatingId(userId);
    try {
      const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
      await updateUserStatus(userId, newStatus);
      await fetchUsers(searchTerm);
      toast.success(`Statut utilisateur mis à jour : ${newStatus === 'blocked' ? 'Bloqué' : 'Actif'}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de la modification du statut");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
    setDeletingId(userId);
    try {
      await deleteUser(userId);
      await fetchUsers(searchTerm);
      toast.success("Utilisateur supprimé avec succès");
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (user) => {
    setEditForm(user);
    setIsCreating(false); // Mode modification
    setShowEditModal(true);
  };

  const handleCreateClick = () => {
    setEditForm({
      _id: '',
      username: '',
      email: '',
      role: 'user',
      status: 'active'
    });
    setIsCreating(true); // Mode création
    setShowEditModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isCreating) {
        await createUser(editForm); // Appel à la fonction de création
        toast.success("Nouvel utilisateur créé avec succès");
      } else {
        // Implémenter la logique de mise à jour ici si nécessaire
        toast.success("Modifications enregistrées");
      }
      await fetchUsers(searchTerm);
      setShowEditModal(false);
    } catch (error) {
      toast.error("Échec de l'opération");
    }
  };

  if (loading) {
    return (
      <div className="ml-64 mr-4 flex justify-center items-center h-screen">
        <PropagateLoader color="#3B82F6" size={15} />
      </div>
    );
  }

  return (
    <div className="mr-4 p-6 bg-gray-50  mt-10 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Gestion des Utilisateurs</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-700 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              onClick={handleCreateClick}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaUserPlus className="mr-2" />
              Créer un compte
            </button>
            <button
              onClick={() => navigate('/addAdmin')}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FaUserShield className="mr-2" />
              Ajouter un admin
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inscription</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {user.role === 'admin' ? (
                            <FaUserShield className="text-blue-500 mr-2" />
                          ) : (
                            <FaUser className="text-gray-400 mr-2" />
                          )}
                          <span className="font-medium">{user.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-sm capitalize">{user.role}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {user.status === 'blocked' ? 'Bloqué' : 'Actif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaUserEdit />
                          </button>
                          <button
                            onClick={() => handleStatusToggle(user._id, user.status)}
                            disabled={updatingId === user._id}
                            className={`${user.status === 'blocked' ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'} ${
                              updatingId === user._id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {updatingId === user._id ? (
                              <FaSpinner className="animate-spin text-lg" />
                            ) : user.status === 'blocked' ? (
                              <FaUnlock className="text-lg" />
                            ) : (
                              <FaLock className="text-lg" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            disabled={deletingId === user._id}
                            className={`text-red-600 hover:text-red-800 ${
                              deletingId === user._id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {deletingId === user._id ? (
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
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                {isCreating ? 'Créer un utilisateur' : 'Modifier l\'utilisateur'}
              </h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                  <input
                    required
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="user">Utilisateur</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Actif</option>
                      <option value="blocked">Bloqué</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {isCreating ? 'Créer' : 'Sauvegarder'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;