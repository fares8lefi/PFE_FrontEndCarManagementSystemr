import React, { useState, useEffect } from "react";

import { getUsersbyId } from "../services/ApiUser";

export default function ProfileCard() {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [user, setUser] = useState({ username: "", email: "", user_image: "" });
  const [editedUser, setEditedUser] = useState({
    username: "",
    email: "",
    user_image: "",
  });
  //get user data
  const UserData = async () => {
    try {
      const response = await getUsersbyId();
      setUser(response.data.user);
      setEditedUser(response.data.user); 
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données utilisateur:",
        error
      );
    }
  };

  useEffect(() => {
    UserData();
  }, []);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser({ ...editedUser, user_image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  
 
  return (
    <div className="relative mt-20">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto font-sans relative">
        <div className="relative mx-auto -mt-20 mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg">
            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
              {user.user_image ? (
                <img
                  src={user.user_image}
                  alt="Profil"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-2xl">?</span>
              )}
            </div>
            <button
              onClick={() => setShowEditDialog(true)}
              className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition-all duration-200 transform hover:scale-105"
            >
              ✏️
            </button>
          </div>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Profil</h1>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Username</span>
            <span className="text-gray-800">{user.username}</span>
          </div>

          <hr className="my-4 border-gray-200" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Email</span>
              <span className="text-gray-800">{user.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Boîte de dialogue */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Modifier le profil</h2>
            {/*formulaire de mise a jour  */}
            <form >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={editedUser.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Photo de profil
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    accept="image/*"
                  />
                  {editedUser.user_image && (
                    <img
                      src={editedUser.user_image}
                      alt="Preview"
                      className="w-20 h-20 rounded-full mt-2 object-cover"
                    />
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
