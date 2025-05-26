import React, { useState, useEffect } from "react";
import { getUsersbyId } from "../services/ApiUser";
import Favoris from "../components/Favoris";
import UserCars from "../components/UserCars";
import EditProfileForm from "../components/EditProfileForm";
import Parametres from '../components/Parametres';
import { PropagateLoader } from 'react-spinners';

export default function ProfileCard() {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("mes-vehicules");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const UserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUsersbyId();
      if (response?.data?.user) {
        setUser(response.data.user);
      } else {
        setError('No user data received');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    UserData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 px-4 flex justify-center items-center min-h-[400px]">
        <PropagateLoader color="#3B82F6" size={15} speedMultiplier={0.8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={UserData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-600">No user data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-white shadow-sm">
            {user.user_image ? (
              <img
                src={user.user_image}
                alt="Profil"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                  e.target.onerror = null;
                }}
              />
            ) : (
              <span className="text-gray-400 text-2xl">?</span>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800">{user.username || 'User'}</h1>
            <p className="text-gray-600">{user.email || 'No email provided'}</p>
          </div>

          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowEditDialog(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Modifier le profil
            </button>
          </div>
        </div>

        <div className="bg-gray-50 border-t border-gray-200">
          <nav className="flex justify-between">
            {[
              { id: "mes-vehicules", label: "Mes véhicules" },
              { id: "favoris", label: "Favoris" },
              { id: "Parametres", label: "Parametres" },
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

      <div className="mt-6">
        {activeTab === "favoris" && <Favoris key="favoris" />}
        {activeTab === "mes-vehicules" && <UserCars key="mes-vehicules" />}
        {activeTab === "Parametres" && <Parametres key="Parametres" />}
      </div>

      {showEditDialog && user && (
        <EditProfileForm
          user={user}
          onClose={() => setShowEditDialog(false)}
          onUpdated={(updatedUser) => {
            setUser(prev => ({ ...prev, ...updatedUser }));
          }}
        />
      )}
    </div>
  );
}
