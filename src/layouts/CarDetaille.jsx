import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCarById } from "../services/ApiCar";
import CarPlusDetaille from "../components/CarPlusDetaille";
import CommentCards from "../components/CommentCards";
import { MdDateRange, MdOutlinePending, MdLocalGasStation, MdSpeed } from "react-icons/md";
import { GiGearStickPattern, GiCarDoor, GiCarKey } from "react-icons/gi";
import { PropagateLoader } from 'react-spinners';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function CarDetaille() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const CarDetails = async () => {
    try {
      setLoading(true);
      const response = await getCarById(id);
      if (response.data) {
        const carData = response.data;
        setCar(carData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) CarDetails();
  }, [id]);

  const nextImage = () => {
    setSelectedIndex((prev) => 
      prev === car.cars_images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedIndex((prev) => 
      prev === 0 ? car.cars_images.length - 1 : prev - 1
    );
  };

  const convertBufferToUrl = (imageData) => {
    if (!imageData) return '';
    
    if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
      return imageData;
    }
    
    try {
      return `data:image/jpeg;base64,${imageData}`;
    } catch (error) {
      console.error('Erreur de conversion d\'image:', error);
      return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <PropagateLoader color="#3B82F6" />
          <p className="mt-4 text-gray-600">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <h2 className="text-2xl font-bold mb-2">Véhicule non trouvé</h2>
          <p>Les détails de ce véhicule ne sont pas disponibles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Section Image Gallery */}
          <div className="relative">
            {/* Image principale */}
            <div className="relative h-[60vh] bg-gray-100">
              {car.cars_images ? (
                <>
                  <img
                    src={car.cars_images}
                    alt={`${car.marque} ${car.model}`}
                    className="w-full h-full object-contain cursor-zoom-in transition-opacity duration-300"
                    onClick={() => setIsOpen(true)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-car.png';
                    }}
                  />
                  {Array.isArray(car.cars_images) && car.cars_images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {selectedIndex + 1} / {car.cars_images.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                  <GiCarKey className="text-6xl text-gray-400 mb-2" />
                  <span className="text-gray-500">Aucune image disponible</span>
                </div>
              )}
            </div>

            {/* Miniatures (si plusieurs images) */}
            {Array.isArray(car.cars_images) && car.cars_images.length > 1 && (
              <div className="relative mt-4 px-4">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {car.cars_images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedIndex(index)}
                      className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedIndex === index 
                          ? 'border-blue-600 shadow-lg scale-105' 
                          : 'border-transparent hover:border-blue-400'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Miniature ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-car.png';
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Informations principales */}
          <div className="px-6 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {car.marque} {car.model}
                </h1>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {car.year}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {car.statut}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-3xl font-bold text-blue-600">{car.price} TND</span>
               
              </div>
            </div>

            {/* Caractéristiques */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <MdLocalGasStation className="text-2xl text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Carburant</p>
                    <p className="font-medium">{car.Energie}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <GiGearStickPattern className="text-2xl text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Boîte</p>
                    <p className="font-medium">{car.Boite}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <MdSpeed className="text-2xl text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Kilométrage</p>
                    <p className="font-medium">{car.km} km</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <MdSpeed className="text-2xl text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Puissance Fiscal</p>
                    <p className="font-medium">{car.Puissance} Ch</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-semibold mb-4">Description</h3>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {car.description}
              </p>
            </div>
          </div>
        </div>

        {/* Modal pour l'image en plein écran */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <img
                src={car.cars_images}
                alt={`${car.marque} ${car.model}`}
                className="max-w-full max-h-[90vh] object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-car.png';
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/75 rounded-full p-2 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Sections supplémentaires */}
        <div className="mt-8">
          <CarPlusDetaille />
        </div>
        <div className="mt-8">
          <CommentCards carId={id} />
        </div>
      </div>
    </div>
  );
}
