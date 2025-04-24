import { React, useState, useEffect } from "react";
import { addNewsLetter } from "../services/ApiNewsLetter";
import { Facebook, Instagram, Twitter, Phone, Email, LocationOn, ArrowForward, CheckCircle } from '@mui/icons-material';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Composant Newsletter séparé
const Newsletter = ({ onSubmit, isSubscribed }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email);
    setEmail("");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <h3 className="text-2xl font-bold text-white mb-4">
        Restez connecté
      </h3>
      <p className="text-gray-300 mb-6">
        Inscrivez-vous à notre newsletter pour recevoir en avant-première :
      </p>
      <ul className="text-gray-300 mb-6 space-y-2">
        <li className="flex items-center space-x-2">
          <CheckCircle className="text-blue-500 w-5 h-5" />
          <span>Nos dernières offres exclusives</span>
        </li>
        <li className="flex items-center space-x-2">
          <CheckCircle className="text-blue-500 w-5 h-5" />
          <span>Les nouveaux véhicules disponibles</span>
        </li>
        <li className="flex items-center space-x-2">
          <CheckCircle className="text-blue-500 w-5 h-5" />
          <span>Des conseils d'experts automobiles</span>
        </li>
      </ul>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            className="w-full px-6 py-4 bg-white/10 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     text-white placeholder-gray-400
                     transition-all duration-300"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-4 px-6 rounded-xl font-medium
                     transition-all duration-300 transform hover:scale-[1.02]
                     ${isSubscribed 
                       ? 'bg-green-500 hover:bg-green-600' 
                       : 'bg-blue-500 hover:bg-blue-600'
                     } text-white flex items-center justify-center space-x-2`}
        >
          <span>{isSubscribed ? 'Merci pour votre inscription !' : 'S\'abonner à la newsletter'}</span>
          {!isSubscribed && <ArrowForward className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
};

export default function Footer() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = async (email) => {
    try {
      await addNewsLetter({ email });
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
    } catch (error) {
      console.error("Erreur d'inscription :", error);
      alert("Une erreur est survenue lors de l'inscription");
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black pt-20 pb-10">
      <div className="absolute inset-0 bg-[url('../public/background.jpg')] bg-cover bg-center opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Section Newsletter */}
          <div className="lg:col-span-1" data-aos="fade-right">
            <Newsletter onSubmit={handleNewsletterSubmit} isSubscribed={isSubscribed} />
          </div>

          {/* Section Contact et Liens */}
          <div className="lg:col-span-1 grid grid-cols-1 md:grid-cols-2 gap-8" data-aos="fade-left">
            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Contactez-nous</h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                  <LocationOn className="text-blue-500" />
                  <span>Mahdia Sidi Massoude, 5100</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                  <Phone className="text-blue-500" />
                  <span>+216 50 746 656</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                  <Email className="text-blue-500" />
                  <span>contact@autoservice.com</span>
                </li>
              </ul>

              {/* Social Media */}
              <div className="pt-6">
                <h4 className="text-lg font-semibold text-white mb-4">Suivez-nous</h4>
                <div className="flex space-x-4">
                  {[
                    { icon: <Facebook />, bg: "bg-blue-600 hover:bg-blue-700" },
                    { icon: <Instagram />, bg: "bg-pink-600 hover:bg-pink-700" },
                    { icon: <Twitter />, bg: "bg-blue-400 hover:bg-blue-500" }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`${social.bg} w-10 h-10 rounded-full flex items-center justify-center
                                text-white transition-all duration-300 transform hover:scale-110`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Liens rapides</h3>
              <ul className="space-y-3">
                {["Accueil", "À propos", "Services", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <ArrowForward className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{item}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 mt-8 border-t border-gray-800 text-center" data-aos="fade-up">
          <p className="text-gray-400">
            © {new Date().getFullYear()} AutoMarket. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}