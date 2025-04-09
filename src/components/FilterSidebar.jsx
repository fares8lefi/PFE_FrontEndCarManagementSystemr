import React, { useState } from "react";
import { GiCarKey, GiGasPump, GiGearStick } from "react-icons/gi";

const FilterSidebar = ({ onFilterChange, searchedMarque }) => {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [yearRange, setYearRange] = useState([1970, new Date().getFullYear()]);
  const [mileage, setMileage] = useState(300000);
  const [selectedEnergy, setSelectedEnergy] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");

  const energyTypes = ["Essence", "Diesel", "Hybride", "Électrique"];
  const transmissionTypes = ["Automatique", "Manuelle"];

  const handleApplyFilters = () => {
    onFilterChange({
      marque: searchedMarque, // 👈 garde la marque originale !
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minYear: yearRange[0],
      maxYear: yearRange[1],
      maxMileage: mileage,
      energy: selectedEnergy,
      transmission: selectedTransmission,
    });
  };

  const handleReset = () => {
    setPriceRange([0, 100000]);
    setYearRange([1970, new Date().getFullYear()]);
    setMileage(300000);
    setSelectedEnergy("");
    setSelectedTransmission("");
    onFilterChange({});
  };

  const CustomSlider = ({ min, max, value, onChange, label, unit, step }) => (
    <div className="mb-8">
      <h3 className="font-semibold mb-4">{label}</h3>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full range-slider"
      />
      <div className="flex justify-between text-sm mt-2">
        <span>
          {min.toLocaleString()}
          {unit}
        </span>
        <span>
          {value.toLocaleString()}
          {unit}
        </span>
        <span>
          {max.toLocaleString()}
          {unit}
        </span>
      </div>
    </div>
  );

  const CustomRangeSlider = ({
    min,
    max,
    value,
    onChange,
    label,
    unit,
    step,
  }) => {
    const handleMinChange = (e) => {
      const newMin = Number(e.target.value);
      onChange([newMin, value[1]]);
    };

    const handleMaxChange = (e) => {
      const newMax = Number(e.target.value);
      onChange([value[0], newMax]);
    };

    return (
      <div className="mb-8">
        <h3 className="font-semibold mb-4">{label}</h3>
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={handleMinChange}
            className="absolute w-full z-10 opacity-0"
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[1]}
            onChange={handleMaxChange}
            className="absolute w-full z-10 opacity-0"
          />
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div
              className="absolute h-full bg-blue-500 rounded-full"
              style={{
                left: `${((value[0] - min) / (max - min)) * 100}%`,
                right: `${100 - ((value[1] - min) / (max - min)) * 100}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>
              {value[0].toLocaleString()}
              {unit}
            </span>
            <span>
              {value[1].toLocaleString()}
              {unit}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-64 bg-white p-4 shadow-lg h-[calc(100vh-4rem)] fixed left-0 top-16 overflow-y-auto z-40">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <GiCarKey className="text-blue-500" />
        Filtres
      </h2>

      <CustomRangeSlider
        label="Prix (€)"
        min={0}
        max={100000}
        value={priceRange}
        onChange={setPriceRange}
        unit="€"
        step={1000}
      />

      <CustomRangeSlider
        label="Année"
        min={1970}
        max={new Date().getFullYear()}
        value={yearRange}
        onChange={setYearRange}
        unit=""
        step={1}
      />

      <CustomSlider
        label="Kilométrage max"
        min={0}
        max={300000}
        value={mileage}
        onChange={setMileage}
        unit=" km"
        step={10000}
      />

      <div className="mb-8">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <GiGasPump className="text-blue-500" />
          Énergie
        </h3>
        <div className="space-y-2">
          {energyTypes.map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="radio"
                name="energy"
                value={type}
                checked={selectedEnergy === type}
                onChange={(e) => setSelectedEnergy(e.target.value)}
                className="form-radio text-blue-500"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <GiGearStick className="text-blue-500" />
          Transmission
        </h3>
        <div className="space-y-2">
          {transmissionTypes.map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="radio"
                name="transmission"
                value={type}
                checked={selectedTransmission === type}
                onChange={(e) => setSelectedTransmission(e.target.value)}
                className="form-radio text-blue-500"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={handleApplyFilters}
          className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Appliquer les filtres
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
