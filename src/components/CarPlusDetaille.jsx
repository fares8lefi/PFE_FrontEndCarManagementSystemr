import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCarById } from "../services/ApiCar";
import { GiGasPump, GiCarKey } from "react-icons/gi";
import { MdOutlineElectricalServices, MdDateRange } from "react-icons/md";
import { GiPositionMarker } from "react-icons/gi";
import { TbManualGearboxFilled } from "react-icons/tb";

export default function CarPlusDetaille() {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    if (id) {
      getCarById(id)
        .then((response) => {
          setCar(response.data || null);
        })
        .catch((error) => console.error(error));
    }
  }, [id]);

  // Affiche un message de chargement si 'car' est null
  if (!car) {
    return <div className="p-4 text-center">Chargement...</div>;
  }

  return (
    <div className="w-full bg-white shadow-2xl rounded-3xl p-8 mt-6">
      <div className="flex justify-between items-center text-xl">
        <span className="mb-2 flex flex-col items-center">
          <img
            src="../public/kilometrage.png"
            alt="Tik Tok icon"
            className="w-6 h-6 fill-current text-white"
          />
          <p className="font-semibold text-gray-700">Kilométrage</p>
          <p className="text-lg text-blue-600">{car.km}</p>
        </span>

        <span className="mb-2 flex flex-col items-center">
          <GiPositionMarker className="w-6 h-6 " aria-hidden="true"/>
          <p className="font-semibold text-gray-700">Position</p>
          <p className="text-lg text-blue-600">{car.Position}</p>
        </span>

        <span className="mb-2 flex flex-col items-center">
         <TbManualGearboxFilled className="h-6 w-"/>
          <p className="font-semibold text-gray-700">Boîte</p>
          <p className="text-lg text-blue-600">{car.Boite}</p>
        </span>

        <span className="mb-2 flex flex-col items-center">
          <img
            src="../public/puissance.png"
            alt="Tik Tok icon"
            className="w-6 h-6 fill-current text-white"
          />
          <p className="font-semibold text-gray-700">Puissance</p>
          <p className="text-lg text-blue-600">{car.Puissance}</p>
        </span>

        <span className="mb-2 flex flex-col items-center">
          <GiGasPump className="w-6 h-6" aria-hidden="true" />
          <p className="font-semibold text-gray-700"> Énergie</p>
          <p className="text-lg text-blue-600">{car.Energie}</p>
        </span>
      </div>
    </div>
  );
}
{
  /*
   <a  
         href="#"
                className="w-8 h-8  rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors duration-200"
              >
                <img
                  src="../public/favori.png"
                  alt="Tik Tok icon"
                  className="w-7 h-7 fill-current text-white"
                />
                <span className="sr-only">Tik Tok</span>
              </a>*/
}
