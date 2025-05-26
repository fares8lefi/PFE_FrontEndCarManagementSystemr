import React, { useRef, useState } from "react";
import { singUpUser, verifyAccount } from "../services/ApiUser";
import Footer from '../components/Footer';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
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
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

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
  
      let imageFile = newUser.user_image;
      if (!imageFile) {
        imageFile = await getDefaultUserImageFile();
      }
      formData.append("user_image", imageFile);
  
      const response = await singUpUser(formData);
  
      if (response.data.success) {
        toast.success("Inscription réussie ! Veuillez vérifier votre email pour le code de vérification.");
        setIsVerifying(true);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Une erreur est survenue lors de l'inscription"
      );
    }
  };

  const handleVerification = async () => {
    try {
      if (!verificationCode) {
        toast.error("Veuillez entrer le code de vérification");
        return;
      }

      const response = await verifyAccount(newUser.email, verificationCode);
      
      if (response.data.success) {
        toast.success("Compte vérifié avec succès !");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Une erreur est survenue lors de la vérification"
      );
    }
  };
  
  async function getDefaultUserImageFile() {
    const response = await fetch('/user.png');
    const blob = await response.blob();
    return new File([blob], "user.png", { type: blob.type });
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <section className="flex flex-col items-center justify-center flex-1 p-6 mt-16">
        <div className="border border-gray-200 shadow-xl rounded-2xl p-8 w-full max-w-md bg-white transform transition-all hover:shadow-2xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">
              {isVerifying ? "Vérification du compte" : "Créer un compte"}
            </h3>
            <p className="text-gray-600">
              {isVerifying ? "Entrez le code reçu par email" : "Rejoignez notre communauté"}
            </p>
          </div>

          {!isVerifying ? (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  placeholder="Entrez votre nom d'utilisateur"
                  name="username"
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="Entrez votre email"
                  className="w-full bg-gray-50 border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Entrez votre mot de passe"
                    name="password"
                    onChange={handleChange}
                    ref={Password}
                    className="w-full bg-gray-50 border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    ref={ConfirmPassword}
                    placeholder="Confirmez votre mot de passe"
                    onChange={(e) => (ConfirmPassword.current.value = e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo de profil
                </label>
                <input
                  type="file"
                  name="user_image"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full bg-gray-50 border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <button
                type="button"
                onClick={AddUserClient}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors duration-200 mt-6"
              >
                S'inscrire
              </button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Déjà inscrit ?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Se connecter
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code de vérification
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Entrez le code reçu par email"
                  className="w-full bg-gray-50 border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="button"
                onClick={handleVerification}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors duration-200 mt-6"
              >
                Vérifier le compte
              </button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Vous n'avez pas reçu le code ?{" "}
                  <button
                    onClick={AddUserClient}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Renvoyer
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
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
    </div>
  );
}