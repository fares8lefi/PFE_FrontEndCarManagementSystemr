import React from 'react';
import CarCards from '../../components/CarCards';

const AllCars = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Tous les véhicules</h1>
        <CarCards />
      </div>
    </div>
  );
};

export default AllCars; 