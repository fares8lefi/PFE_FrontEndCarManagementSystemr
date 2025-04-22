// src/layouts/About.jsx
import React from 'react';
import { FaCarSide, FaUsers, FaHandshake, FaAward } from 'react-icons/fa';

const About = () => {
  return (
    <div className="py-16" data-aos="fade-up">
      <div className="container mx-auto px-4">
        {/* Section Introduction */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Bienvenue chez AutoMarket
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leader dans le marché automobile en Tunisie, nous nous engageons à fournir 
            des services de qualité supérieure et une expérience client exceptionnelle.
          </p>
        </div>

        {/* Chiffres Clés */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
            <div className="text-gray-600">Véhicules Vendus</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">5000+</div>
            <div className="text-gray-600">Clients Satisfaits</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
            <div className="text-gray-600">Années d'Expérience</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Client</div>
          </div>
        </div>

        {/* Notre Mission */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Notre Mission
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed max-w-4xl mx-auto">
            Chez AutoMarket, notre mission est de révolutionner l'expérience d'achat 
            automobile en Tunisie. Nous nous efforçons de fournir un service transparent, 
            professionnel et personnalisé à chacun de nos clients.
          </p>
        </div>

        {/* Nos Valeurs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <FaCarSide className="text-4xl text-blue-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-800 mb-3">
              Excellence
            </h4>
            <p className="text-gray-600">
              Nous nous engageons à fournir des véhicules et des services de la plus haute qualité.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <FaUsers className="text-4xl text-blue-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-800 mb-3">
              Service Client
            </h4>
            <p className="text-gray-600">
              Une équipe dévouée à votre satisfaction et à votre réussite.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <FaHandshake className="text-4xl text-blue-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-800 mb-3">
              Confiance
            </h4>
            <p className="text-gray-600">
              Transparence et honnêteté dans toutes nos transactions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <FaAward className="text-4xl text-blue-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-800 mb-3">
              Innovation
            </h4>
            <p className="text-gray-600">
              Adoption des dernières technologies pour améliorer votre expérience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;