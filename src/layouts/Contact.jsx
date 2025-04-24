import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { createMessage } from '../services/ApiContact';

import AOS from 'aos';
import 'aos/dist/aos.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    sujet: '',
    message: '',
    type: 'question'
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      const response = await createMessage({
        name: formData.name,
        email: formData.email,
        telephone: formData.telephone,
        sujet: formData.sujet,
        message: formData.message
      });
      console.log(response); 
      if (response.data) {
        setStatus({
          loading: false,
          error: null,
          success: true
        });
        // Réinitialiser le formulaire
        setFormData({
          name: '',
          email: '',
          telephone: '',
          sujet: '',
          message: '',
          type: 'question'
        });
      }
    } catch (error) {
      setStatus({
        loading: false,
        error: error.response?.data?.message || 'Une erreur est survenue lors de l\'envoi du message',
        success: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100"
    data-aos="fade-up"
    >
      {/* Hero Section avec animation de fond */}
      <div className="relative bg-sky-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10 pattern-dots"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-down">
            Contactez-nous
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-blue-100">
            Notre équipe est là pour vous aider et répondre à toutes vos questions
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulaire de Contact */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:shadow-3xl transition-all duration-300">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
              Envoyez-nous un message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="name">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 outline-none group-hover:border-blue-300"
                    required
                  />
                </div>
                <div className="group">
                  <label className="block text-gray-700 mb-2 font-medium" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 outline-none group-hover:border-blue-300"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="telephone">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 outline-none group-hover:border-blue-300"
                  required
                />
              </div>

              <div className="group">
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="type">
                  Type de demande
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 outline-none group-hover:border-blue-300 bg-white"
                >
                  <option value="question">Question générale</option>
                  <option value="probleme">Signaler un problème</option>
                  <option value="rdv">Demande de rendez-vous</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="group">
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="sujet">
                  Sujet
                </label>
                <input
                  type="text"
                  id="sujet"
                  name="sujet"
                  value={formData.sujet}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 outline-none group-hover:border-blue-300"
                  required
                />
              </div>

              <div className="group">
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 outline-none group-hover:border-blue-300 resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                  status.loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {status.loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Envoi en cours...
                  </div>
                ) : (
                  'Envoyer le message'
                )}
              </button>

              {status.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 mt-4">
                  {status.error}
                </div>
              )}

              {status.success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 mt-4">
                  Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                </div>
              )}
            </form>
          </div>

          {/* Informations de Contact */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:shadow-3xl transition-all duration-300">
              <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
                Nos Coordonnées
              </h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-6 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaMapMarkerAlt className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">Adresse</h3>
                    <p className="text-gray-600 mt-1">Mahdia hiboun 5100 </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaPhone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">Téléphone</h3>
                    <p className="text-gray-600 mt-1">+216 50 746 656</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaEnvelope className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">Email</h3>
                    <p className="text-gray-600 mt-1">contact@autoservice.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaClock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">Horaires d'ouverture</h3>
                    <p className="text-gray-600 mt-1">Lundi - Vendredi: 9h00 - 18h00</p>
                    <p className="text-gray-600">Samedi: 9h00 - 12h00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
