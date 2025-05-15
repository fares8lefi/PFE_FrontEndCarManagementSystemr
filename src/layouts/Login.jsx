import { React, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { loginUser } from "../services/ApiUser";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from '@react-oauth/google';
import axiosInstance from "../services/axiosConfig";

export default function Login() {
  const navigate = useNavigate();
  const [loginData, setloginData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setloginData({ ...loginData, [name]: value });
  };

  const login = async () => {
    try {
      setIsLoading(true);
      const response = await loginUser(loginData);
      console.log("response du serveure ", response);
      if (response.data?.success) {
        localStorage.setItem("authToken", response.data.token);
        const userRole = response.data.user.role;
        const userStatus = response.data.user.status;
        if (userStatus === "Active") {
          toast.success("Connexion réussie !");
          if (userRole === "admin") {
            navigate("/homeAdmin");
          } else {
            navigate("/home");
          }
        }
      } else {
        toast.error(response.data?.message || "Authentification échouée");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/users/googleLogin', {
        credential: credentialResponse.credential
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const user = response.data.user;
        
        if (user.status === 'inactive' && !user.isNewGoogleUser) {
          toast.error('Votre compte est inactif. Veuillez contacter l\'administrateur.');
          return;
        }

        toast.success("Connexion avec Google réussie !");
        
        if (user.role === 'admin') {
          navigate('/homeAdmin');
        } else {
          navigate('/home');
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        toast.error(error.response.data.message || 'Erreur lors de la connexion avec Google');
      } else {
        toast.error('Erreur de connexion au serveur');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google Sign-In error:', error);
    toast.error('Erreur lors de la connexion avec Google');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <section className="flex flex-col items-center justify-center flex-1 p-6 mt-16">
        <div className="border border-gray-200 shadow-xl rounded-2xl p-8 w-full max-w-md bg-white transform transition-all hover:shadow-2xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">
              Bienvenue
            </h3>
            <p className="text-gray-600">Connectez-vous à votre compte</p>
          </div>

          <div className="flex justify-center mb-6" id="google-login-button">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="filled_blue"
              shape="rectangular"
              text="continue_with"
              locale="fr"
              width="300"
              flow="implicit"
              ux_mode="popup"
              context="signin"
              hosted_domain=""
            />
          </div>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">ou</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Entrez votre email"
                name="email"
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  name="password"
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center my-6 text-sm">
            <label className="flex items-center text-gray-600">
              <input type="checkbox" className="mr-2 rounded text-blue-500 focus:ring-blue-500" />
              Se souvenir de moi
            </label>
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Mot de passe oublié ?
            </button>
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors duration-200 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={login}
            disabled={isLoading}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Vous n'avez pas de compte ?{" "}
            <button
              onClick={() => navigate("/singup")}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Créer un compte
            </button>
          </p>
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
