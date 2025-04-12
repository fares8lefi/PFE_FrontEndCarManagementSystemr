import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Person,
  Email,
  Visibility,
  VisibilityOff,
  Security,
  Logout,
} from "@mui/icons-material";
import AOS from "aos";
import "aos/dist/aos.css";
import { PropagateLoader } from "react-spinners";
import { getUsersbyId ,logout} from "../services/ApiUser";
export default function Parametres() {
  
  const navigate = useNavigate();

  
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [user, setUserData] = useState([]);

  // Effet pour le chargement initial et l'initialisation d'AOS
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await getUsersbyId();

        setUserData(response.data.user);

        // Simulation du chargement
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
    AOS.init({ duration: 1000, once: true });

    return () => {
      AOS.refresh();
    };
  }, []);

  
  // Gestionnaires d'événements
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des mots de passe
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    setFormLoading(true);
    try {
      // Ici, vous ajouterez l'appel API pour changer le mot de passe
      // await changePassword(formData);

      // Simulation du chargement
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Réinitialisation du formulaire après succès
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      alert("Mot de passe mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      alert("Une erreur est survenue lors de la mise à jour du mot de passe");
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout()
      localStorage.removeItem("authToken")
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // Composant de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <PropagateLoader color="#3B82F6" size={15} speedMultiplier={0.8} />
      </div>
    );
  }

  // Rendu principal
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12" data-aos="fade-down">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Paramètres du compte
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Gérez vos informations personnelles et votre sécurité
          </p>
        </div>

        {/* Conteneur principal */}
        <div
          className="bg-white shadow-xl rounded-lg overflow-hidden"
          data-aos="fade-up"
        >
          {/* Section Informations personnelles */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Person className="text-blue-500" />
              Informations personnelles
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Email className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Person className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Nom d'utilisateur</p>
                  <p className="font-medium">{user.username}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section Sécurité */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Security className="text-green-500" />
              Sécurité
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Champ mot de passe actuel */}
              <div>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Mot de passe actuel"
                    className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {showPassword ? (
                      <VisibilityOff
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <Visibility
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={() => setShowPassword(true)}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Champ nouveau mot de passe */}
              <div>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Nouveau mot de passe"
                    className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {showNewPassword ? (
                      <VisibilityOff
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={() => setShowNewPassword(false)}
                      />
                    ) : (
                      <Visibility
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={() => setShowNewPassword(true)}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Champ confirmation mot de passe */}
              <div>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmer le nouveau mot de passe"
                    className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {showConfirmPassword ? (
                      <VisibilityOff
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={() => setShowConfirmPassword(false)}
                      />
                    ) : (
                      <Visibility
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={() => setShowConfirmPassword(true)}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Bouton de soumission */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <PropagateLoader color="#ffffff" size={8} />
                  ) : (
                    "Mettre à jour le mot de passe"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Section Déconnexion */}
          <div className="p-6 bg-gray-50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Logout className="mr-2" />
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
