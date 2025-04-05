import React, { useState, useRef, useEffect } from "react";
import { UpdateUserClientbyId } from "../services/ApiUser";

export default function EditProfileForm({ user, onClose, onUpdated }) {
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [userImage, setUserImage] = useState(null);
  const [preview, setPreview] = useState(user.user_image || "");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Gestion de la prévisualisation d'image
  useEffect(() => {
    if (!userImage) {
      setPreview(user.user_image || "");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(userImage);
  }, [userImage, user.user_image]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setUserImage(file);
    } else {
      setError("Merci de selectionné une image valid");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (userImage) {
      formData.append("user_image", userImage);
    }

    try {
      const response = await UpdateUserClientbyId(formData);
      
      // Mise à jour de l'image en temps réel
      if (userImage) {
        const reader = new FileReader();
        reader.onload = () => {
          onUpdated({ 
            ...response.data,
            user_image: reader.result 
          });
        };
        reader.readAsDataURL(userImage);
      } else {
        onUpdated(response.data);
      }
      
      onClose();
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Modifier le profil
        </h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="mb-4 flex flex-col items-center">
          <div className="relative w-24 h-24 mb-4">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-200">
              <img
                src={preview}
                alt="Aperçu profil"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adresse email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
          >
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
}