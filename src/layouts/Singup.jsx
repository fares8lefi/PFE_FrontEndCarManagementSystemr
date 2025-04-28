import React, { useRef, useState } from "react";
import { addUserClientImgOf } from "../services/ApiUser";
import Footer from '../components/Footer';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ToastContainer, toast ,Zoom} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const Password = useRef(null);
  const ConfirmPassword = useRef(null);

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    user_image: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };
  
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };
  const handleChange = (e) => {
    if (e.target.name === "user_image") {
      if (!e.target.files || e.target.files.length === 0) {
        toast.warning("Veuillez sélectionner une image !");
        return;
      }

      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Seules les images sont autorisées !");
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
      const { username, email, password } = newUser;
  
      if (!username || !email || !password) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }
  
      if (!validateEmail(email)) {
        toast.error("L'adresse e-mail n'est pas valide. Exemple : exemple@domaine.com");
        return;
      }
  
      if (!validatePassword(password)) {
        toast.error("Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial, et avoir 8 caractères minimum.");
        return;
      }
  
      if (Password.current?.value !== ConfirmPassword.current?.value) {
        toast.error("Les mots de passe doivent être identiques !");
        return;
      }
  
      const formData = new FormData();
      formData.append(
        "user",
        JSON.stringify({
          username,
          email,
          password,
        })
      );
  
      // Si aucune image n'est choisie, charge user.png comme fichier
      let imageFile = newUser.user_image;
      if (!imageFile) {
        imageFile = await getDefaultUserImageFile();
      }
      formData.append("user_image", imageFile);
  
      const response = await addUserClientImgOf(formData);
  
      if (response.data.success) {
        toast.success("Enregistrement réussi !");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Une erreur est survenue lors de l'inscription"
      );
    }
  };
  
  async function getDefaultUserImageFile() {
    const response = await fetch('/user.png');
    const blob = await response.blob();
    return new File([blob], "user.png", { type: blob.type });
  }

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
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              onChange={handleChange}
              ref={Password}
              className="w-full bg-gray-200 p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {showPassword ?   <Visibility /> :<VisibilityOff />  }
            </span>
          </div>

          <div className="relative mb-3">
            <input
              type={showConfirmPassword ? "text" : "password"}
              ref={ConfirmPassword}
              placeholder="Confirm your Password"
              onChange={(e) => (ConfirmPassword.current.value = e.target.value)}
              className="w-full bg-gray-200 p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {showConfirmPassword ? <Visibility /> :<VisibilityOff />}
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

          <button
            className="bg-black w-full rounded-3xl py-3 text-white text-center font-semibold hover:bg-gray-800 transition-colors"
            onClick={AddUserClient}
            type="button"
          >
            Sign Up
          </button>
        </div>
        <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      </section>
      <Footer />
    </div>
  );
}