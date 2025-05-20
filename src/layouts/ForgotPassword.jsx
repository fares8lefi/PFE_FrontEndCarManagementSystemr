import { React, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { forgotPassword, verifyResetCode, resetPassword } from "../services/ApiUser";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await forgotPassword(email);
      
      if (response.data.success) {
        toast.success("Un code de réinitialisation a été envoyé à votre adresse email");
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Vérification du code avec:', { email, resetCode }); // Log pour débogage
      const response = await verifyResetCode(email, resetCode);
      
      if (response.data.success) {
        toast.success("Code vérifié avec succès");
        setStep(3);
      }
    } catch (error) {
      console.error('Erreur de vérification:', error.response?.data); // Log pour débogage
      toast.error(
        error.response?.data?.message || 
        "Code invalide ou expiré. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation des champs
    if (!email || !resetCode || !newPassword || !confirmPassword) {
      toast.error("Tous les champs sont requis");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      setIsLoading(false);
      return;
    }

    try {
      console.log('Réinitialisation du mot de passe avec:', { 
        email, 
        code: resetCode, 
        newPassword 
      }); // Log pour débogage
      
      const response = await resetPassword(email, resetCode, newPassword);
      
      if (response.data.success) {
        toast.success(response.data.message || "Mot de passe réinitialisé avec succès");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur de réinitialisation:', error.response?.data); // Log pour débogage
      
      // Gestion spécifique des erreurs du backend
      if (error.response?.data?.message === "Code invalide ou expiré") {
        toast.error("Le code de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau code.");
        setStep(1); // Retour à l'étape de demande de code
      } else {
        toast.error(
          error.response?.data?.message || 
          error.message ||
          "Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
                required
                className="w-full bg-gray-50 border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors duration-200 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Envoi en cours..." : "Envoyer le code"}
            </button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code de réinitialisation
              </label>
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                placeholder="Entrez le code reçu"
                required
                className="w-full bg-gray-50 border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors duration-200 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Vérification..." : "Vérifier le code"}
            </button>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Entrez votre nouveau mot de passe"
                required
                className="w-full bg-gray-50 border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmez votre nouveau mot de passe"
                required
                className="w-full bg-gray-50 border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors duration-200 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <section className="flex flex-col items-center justify-center flex-1 p-6 mt-16">
        <div className="border border-gray-200 shadow-xl rounded-2xl p-8 w-full max-w-md bg-white transform transition-all hover:shadow-2xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">
              {step === 1 && "Mot de passe oublié ?"}
              {step === 2 && "Vérification du code"}
              {step === 3 && "Nouveau mot de passe"}
            </h3>
            <p className="text-gray-600">
              {step === 1 && "Entrez votre adresse email pour recevoir un code de réinitialisation"}
              {step === 2 && "Entrez le code reçu par email"}
              {step === 3 && "Choisissez votre nouveau mot de passe"}
            </p>
          </div>

          {renderStep()}

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Retour à la connexion
            </button>
          </div>
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