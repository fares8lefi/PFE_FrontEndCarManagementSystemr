import React, { useState } from "react";
import { GiCarKey, GiGasPump, GiGearStick } from "react-icons/gi";
import { MdSpeed, MdDateRange, MdOutlineElectricalServices } from "react-icons/md";
import { FaEuroSign, FaFilter, FaUndo } from "react-icons/fa";

const FilterSidebar = ({ onFilterChange, searchedMarque }) => {
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [yearRange, setYearRange] = useState([1970, new Date().getFullYear()]);
  const [kmRange, setKmRange] = useState([0, 300000]);
  const [selectedEnergie, setSelectedEnergie] = useState("");
  const [selectedBoite, setSelectedBoite] = useState("");
  const [puissanceRange, setPuissanceRange] = useState([0, 500]);
  const [isOpen, setIsOpen] = useState(true);

  const energieTypes = ["Essence", "Diesel", "Hybrid", "Electric"];
  const boiteTypes = ["Auto", "Manuelle"];

  const handleApplyFilters = () => {
    const filters = {
      marque: searchedMarque ? searchedMarque.toString() : "",
      minPrice: Number(priceRange[0]),
      maxPrice: Number(priceRange[1]),
      minYear: Number(yearRange[0]),
      maxYear: Number(yearRange[1]),
      minKm: Number(kmRange[0]),
      maxKm: Number(kmRange[1]),
      Energie: selectedEnergie ? selectedEnergie.toString() : "",
      Boite: selectedBoite ? selectedBoite.toString() : "",
      minPuissance: Number(puissanceRange[0]),
      maxPuissance: Number(puissanceRange[1])
    };
    onFilterChange(filters);
  };

  const handleReset = () => {
    setPriceRange([0, 1000000]);
    setYearRange([1970, new Date().getFullYear()]);
    setKmRange([0, 300000]);
    setPuissanceRange([0, 500]);
    setSelectedEnergie("");
    setSelectedBoite("");
    onFilterChange({});
  };

  const renderRangeSlider = ({ 
    label, 
    icon: Icon, 
    value, 
    onChange, 
    min, 
    max, 
    step, 
    unit 
  }) => (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="text-blue-500 text-xl" />
        <h3 className="font-semibold text-gray-800">{label}</h3>
      </div>
      <div className="px-2">
        <div className="relative mb-4">
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="absolute h-2 bg-blue-500 rounded"
              style={{
                left: `${((value[0] - min) / (max - min)) * 100}%`,
                right: `${100 - ((value[1] - min) / (max - min)) * 100}%`
              }}
            />
          </div>
          <input
            type="range"
            min={min}
            max={max}
            value={value[0]}
            step={step}
            onChange={(e) => onChange([Number(e.target.value), value[1]])}
            className="absolute w-full h-2 opacity-0 cursor-pointer"
          />
          <input
            type="range"
            min={min}
            max={max}
            value={value[1]}
            step={step}
            onChange={(e) => onChange([value[0], Number(e.target.value)])}
            className="absolute w-full h-2 opacity-0 cursor-pointer"
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{value[0].toLocaleString()}{unit}</span>
          <span>{value[1].toLocaleString()}{unit}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-40">
      <div className="w-80 h-full bg-gray-50 shadow-xl overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <GiCarKey className="text-blue-500" />
              Filtres
            </h2>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FaFilter className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {renderRangeSlider({
            label: "Prix",
            icon: FaEuroSign,
            value: priceRange,
            onChange: setPriceRange,
            min: 0,
            max: 1000000,
            step: 5000,
            unit: " TND"
          })}

          {renderRangeSlider({
            label: "Année",
            icon: MdDateRange,
            value: yearRange,
            onChange: setYearRange,
            min: 1970,
            max: new Date().getFullYear(),
            step: 1,
            unit: ""
          })}

          {renderRangeSlider({
            label: "Kilométrage",
            icon: MdSpeed,
            value: kmRange,
            onChange: setKmRange,
            min: 0,
            max: 300000,
            step: 5000,
            unit: " km"
          })}

          {renderRangeSlider({
            label: "Puissance",
            icon: MdOutlineElectricalServices,
            value: puissanceRange,
            onChange: setPuissanceRange,
            min: 0,
            max: 500,
            step: 10,
            unit: " ch"
          })}

          {/* Énergie */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <GiGasPump className="text-blue-500 text-xl" />
              <h3 className="font-semibold text-gray-800">Énergie</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {energieTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedEnergie(type === selectedEnergie ? "" : type)}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    selectedEnergie === type
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Boîte de vitesse */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <GiGearStick className="text-blue-500 text-xl" />
              <h3 className="font-semibold text-gray-800">Boîte de vitesse</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {boiteTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedBoite(type === selectedBoite ? "" : type)}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    selectedBoite === type
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4 space-y-2">
          <button
            onClick={handleApplyFilters}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaFilter />
            Appliquer les filtres
          </button>
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaUndo />
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;

