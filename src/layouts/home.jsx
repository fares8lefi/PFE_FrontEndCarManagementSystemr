import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CarCards from '../components/CarCards';
import Services from './Services';
import Contact from './Contact';
import About from './About';

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const isLoggedIn = !!localStorage.getItem("authToken");

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?marque=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="relative">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-b from-gray-900 to-gray-600 flex items-center">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto px-4 pt-16 relative z-10">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Découvrez notre sélection de véhicules 
            </h1>
            <p className="text-xl mb-12">
              Profitez d'une expérience d'achat unique
            </p>

            {/* Formulaire de recherche visible seulement si connecté */}
            {isLoggedIn && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6">
                  Rechercher votre véhicule idéal
                </h2>
                <form onSubmit={handleSearch} className="flex gap-4">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Entrez la marque..."
                    className="flex-1 px-6 py-4 rounded-xl bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    Rechercher
                  </button>
                </form>
              </div>
            )}

            <div className="mt-12 flex justify-center gap-4">
              {isLoggedIn && (
                <button
                  onClick={() => navigate("/addCarAnnounecement")}
                  className="inline-flex items-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full transition-all transform hover:-translate-y-1 font-semibold"
                >
                  + Ajouter une voiture
                </button>
              )}
              <button 
                onClick={() => {
                  document.getElementById('vehicules').scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
                className="inline-flex items-center px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all transform hover:-translate-y-1 font-semibold"
              >
                Découvrir nos véhicules
              </button>
            </div>
          </div>
        </div>
      </section>

   
      {/* Vehicles Section */}
      <section id="vehicules" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nos Véhicules
          </h2>
          <div className="mb-8">
            <p className="text-xl text-center text-grays-50 font-semibold italic">
               Trouvez la voiture qui vous ressemble parmi notre sélection exclusive !
            </p>
          </div>
          <CarCards />
        </div>
        {/* Services Section */}
      </section>
      <section id="about-us" className="py-20 bg-white">
        <About />
      </section>
      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nos Services
          </h2>
          <Services />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Contactez-nous
          </h2>
          <Contact />
        </div>
      </section>

      <Footer />
    </div>
  );
}
