import React from 'react';
import { FaCar, FaTools, FaHandshake, FaShieldAlt, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
const Services = () => {
  return (
    <div className="min-h-screen bg-white"
    data-aos="fade-up"
    >
      <div className='bg-gray-50  h-1'></div>
      {/* Hero Section */}
      <div className="bg-white text-black py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Nos Services Premium
          </h1>
          <p className="text-xl text-center max-w-2xl mx-auto">
            Découvrez notre gamme complète de services automobiles de haute qualité
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col items-center text-center">
              <FaCar className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Vente de Voitures</h3>
              <p className="text-gray-600">Large sélection de voitures neuves et d'occasion de qualité supérieure</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col items-center text-center">
              <FaTools className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Service Maintenance</h3>
              <p className="text-gray-600">Entretien professionnel et réparations par des experts qualifiés</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col items-center text-center">
              <FaHandshake className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Conseil Personnalisé</h3>
              <p className="text-gray-600">Accompagnement expert pour trouver le véhicule parfait pour vous</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col items-center text-center">
              <FaShieldAlt className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Garantie Étendue</h3>
              <p className="text-gray-600">Protection complète pour votre tranquillité d'esprit</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col items-center text-center">
              <FaClock className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Service Rapide</h3>
              <p className="text-gray-600">Processus d'achat simplifié et service client disponible 24/7</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col items-center text-center">
              <FaMoneyBillWave className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Solutions de Financement</h3>
              <p className="text-gray-600">Options de financement flexibles adaptées à votre budget</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Services;
