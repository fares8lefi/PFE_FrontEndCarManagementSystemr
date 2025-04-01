import React, { useState, useEffect } from "react";
import { getUsersbyId } from "../services/ApiUser";
import Favoris from "../components/Favoris";
import UserCars from "../components/UserCars";

export default function ProfileCard() {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("informations");
  const [user, setUser] = useState({
    username: "",
    email: "",
    user_image: "",
  });

  const UserData = async () => {
    try {
      const response = await getUsersbyId();
      setUser(response.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    UserData();
  }, []);

    if (file) {
  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      {/* carte de profil */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* image de profil */}
          <div className="relative min-w-[6rem]">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-white shadow-sm">
              {user.user_image ? (
                <img
                  src={`data:image/png;base64,${user.user_image}`}
                  alt="Profil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-2xl">?</span>
              )}
            </div>
          </div>

          {/* informations principale */}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800">{user.username}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>

          {/* bouton modifier profil*/}
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowEditDialog(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Modifier le profil
            </button>
          </div>
        </div>

        {/* navbar*/}
        <div className="bg-gray-50 border-t border-gray-200">
          <nav className="flex justify-between">
            {[
              { id: "informations", label: "Informations" },
              { id: "mes-vehicules", label: "Mes véhicules" },
              { id: "favoris", label: "Favoris" },
              { id: "parametres", label: "Paramètres" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-2 text-center text-sm font-medium transition-colors
                  ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="mt-6">
        {activeTab === "favoris" && <Favoris key="favoris" />}
        {activeTab === "mes-vehicules" && <UserCars key="mes-vehicules" />}
        
      </div>
    </div>
  );
}