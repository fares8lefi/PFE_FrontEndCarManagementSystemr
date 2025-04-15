import React, { useRef, useState } from "react";
import { addUserClientImgOf } from "../services/ApiUser";
import Footer from '../components/Footer';
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Singup() {
  const Password = useRef(null);
  const ConfirmPassword = useRef(null);

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    user_image: "",
  });

  const [showPassword, setShowPassword] = useState(false); // Nouvel état pour gérer la visibilité du mot de passe
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Nouvel état pour la confirmation du mot de passe

  const handleChange = (e) => {
    if (e.target.name === "user_image") {
      if (!e.target.files || e.target.files.length === 0) {
        alert("Veuillez sélectionner une image !");
        return;
      }

      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        alert("Seules les images sont autorisées !");
        return;
      }

      setNewUser({ ...newUser, [e.target.name]: file });
    } else {
      const { name, value } = e.target;
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const AddUserClient = async () => {
    try {
      if (Password.current?.value !== ConfirmPassword.current?.value) {
        alert("Les mots de passe doivent être identiques !");
        return;
      }

      const formData = new FormData();
      formData.append(
        "user",
        JSON.stringify({
          username: newUser.username,
          email: newUser.email,
          password: newUser.password,
        })
      );
      formData.append("user_image", newUser.user_image);

      await addUserClientImgOf(formData);
      alert("Enregistrement réussi !");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="flex flex-col items-center justify-center flex-1 p-6">
        <div className="border border-gray-300 shadow-2xl shadow-gray-500 p-8 rounded-xl w-full max-w-md bg-white">
          <h3 className="text-2xl font-bold text-center mb-2">Create Your Account</h3>
          <p className="text-gray-600 text-center mb-4">Let's Get Started</p>

          <input
            type="text"
            placeholder="User name"
            name="username"
            onChange={handleChange}
            className="w-full bg-gray-200 p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
          <input
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Enter Your E-Mail"
            className="w-full bg-gray-200 p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"} // Conditionner l'affichage du mot de passe
              placeholder="Password"
              name="password"
              onChange={handleChange}
              ref={Password}
              className="w-full bg-gray-200 p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)} // Bascule la visibilité du mot de passe
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </span>
          </div>
          <div className="relative mb-3">
            <input
              type={showConfirmPassword ? "text" : "password"} // Conditionner l'affichage du mot de passe de confirmation
              ref={ConfirmPassword}
              placeholder="Confirm your Password"
              className="w-full bg-gray-200 p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Bascule la visibilité du mot de passe de confirmation
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
            </span>
          </div>

          <input
            type="file"
            placeholder="Upload your profile image"
            name="user_image"
            onChange={handleChange}
            accept="image/*"
            className="w-full bg-gray-200 p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />

          <div className="flex justify-between items-center mb-4 text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember Me
            </label>
          </div>

          <button
            className="bg-black w-full rounded-3xl py-3 text-white text-center font-semibold"
            onClick={AddUserClient}
            type="button"
          >
            Sign Up
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
}
