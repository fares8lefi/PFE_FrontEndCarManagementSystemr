import { React, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { loginUser } from "../services/ApiUser";
import { useNavigate } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ToastContainer, toast, } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Login() {
  const navigate = useNavigate();
  const [loginData, setloginData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setloginData({ ...loginData, [name]: value });
  };
  const login = async () => {
    try {
      const response = await loginUser(loginData);

      if (response.data?.success) {
        localStorage.setItem("authToken", response.data.token);
        const userRole = response.data.user.role;
        const userStatus=response.data.user.status;
       if(userStatus==="Active"){
        if (userRole === "admin") {
          navigate("/usersTable");
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
    }
  };
  const passwordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSinUp = () => navigate("/singup");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <section className="flex flex-col items-center justify-center flex-1 p-6 mt-16">
        <div className="border border-gray-300 shadow-2xl shadow-gray-500 p-8 rounded-xl w-full max-w-md bg-white">
          <h3 className="text-2xl font-bold text-center mb-2">
            Create Your Account
          </h3>
          <p className="text-gray-600 text-center mb-4">Let's Get Started </p>

          <button className="flex items-center justify-center w-full border border-gray-300 rounded-3xl py-2 mb-4">
            <GoogleIcon fontSize="small" className="mx-2" /> Login with Google
          </button>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-2 text-gray-500">Or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <input
            type="email"
            placeholder="Enter Your E-Mail"
            name="email"
            onChange={handleChange}
            className="w-full bg-gray-200  p-3 rounded-3xl focus:outline-none focus:ring-2 focus:-blue-500 pr-10"
          />

          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              onChange={handleChange}
              className="w-full bg-gray-200  mt-6 p-3 rounded-3xl focus:outline-none focus:ring-2 focus:-blue-500 pr-10"
            />
            <button
              type="button"
              onClick={passwordVisibility}
              className="absolute right-3 mt-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </button>
          </div>

          <div className="flex justify-between items-center mb-4 text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember Me
            </label>
            <a href="#" className="text-amber-700">
              Forgot Password ?
            </a>
          </div>

          <button
            className="bg-black w-full rounded-3xl py-3 text-white text-center font-semibold"
            onClick={login}
          >
            LogIn
          </button>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-2 text-gray-500">Or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <button className="flex items-center justify-center w-full border border-gray-300 rounded-3xl py-2">
            <FacebookIcon fontSize="small" className="mx-2" /> Login with
            Facebook
          </button>

          <p className="text-center text-sm mt-4 text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={handleSinUp}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Create an account
            </button>
          </p>
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
      </section>
      <Footer />
    </div>
  );
}
