import axios from "axios";
import axiosInstance from './axiosConfig';

const apiurl = "http://localhost:3003/cars";

export async function getAllCars() {
  return await axios.get(`${apiurl}/getAllCars`);
}

export async function getCarById(id) {
  return await axios.get(`${apiurl}/getCarById/${id}`);
}


export const addCarImages = (submitCarData) => {
  return axios.post(`${apiurl}/addCarImages`, submitCarData, {
    withCredentials: true, //activations des cokkies
  });
};

export const getUserCars = () => {
  return axiosInstance.get(`${apiurl}/getUserCars`);
};

export const deleteCarByID = (carId) => {
  return axios.delete(`${apiurl}/deleteCarByID`,
     {
      data: { carId:carId } , 
    withCredentials: true, //activations des cokkies
  });
};

export const UpdateCarById = (carId, updatedData) => {
  // Vérifier si updatedData est une instance de FormData
  const isFormData = updatedData instanceof FormData;
  
  return axios.put(`${apiurl}/UpdateCarById/${carId}`, updatedData, {
    withCredentials: true,
    headers: {
      // Si c'est FormData, ne pas définir Content-Type pour laisser axios le faire automatiquement
      ...(isFormData ? {} : { 'Content-Type': 'application/json' })
    }
  });
};

export const getCarsByMarque = (marque) =>
  axios.get(`${apiurl}/getCarsByMarque`, { params: { marque } });

export const getCarsFiltered = (filters = {}) => {
  // Formatage des filtres selon ce que le backend attend
  const formattedFilters = {
    marque: filters.marque || '',
    maxPrice: Number(filters.maxPrice) || 1000000,
    minYear: Number(filters.minYear) || 1900,
    maxYear: Number(filters.maxYear) || new Date().getFullYear(),
    minKm: Number(filters.minKm) || 0,
    maxKm: Number(filters.maxKm) || 1000000,
    Energie: filters.Energie || 'Diesel', // Valeur par défaut
    Boite: filters.Boite || 'Manuelle', // Valeur par défaut
  };

  // Vérification que tous les filtres requis sont présents
  const requiredFilters = ['marque', 'maxPrice', 'minYear', 'maxYear', 'maxKm', 'Energie', 'Boite'];
  const missingFilters = requiredFilters.filter(filter => !formattedFilters[filter]);

  if (missingFilters.length > 0) {
    console.error('Filtres manquants:', missingFilters);
    return Promise.reject(new Error('Tous les filtres doivent être appliqués'));
  }

  // Log pour débogage
  console.log('URL de la requête:', `${apiurl}/getCarsFiltered`);
  console.log('Paramètres envoyés:', formattedFilters);

  return axios.get(`${apiurl}/getCarsFiltered`, { 
    params: formattedFilters
  });
};



export const getCarStats = () => {
  return axios.get(`${apiurl}/getCarStats`,{
    withCredentials: true,
  });
};

export const getLatestCars = () => {
  return axiosInstance.get(`${apiurl}/getLatestCars`);
};


export const getMonthlySalesStats = () => {
  return axiosInstance.get(`${apiurl}/getMonthlySalesStats`);
};

export const getPriceStatsByBrand = () => {
  return axios.get(`${apiurl}/getPriceStatsByBrand`,{
    withCredentials: true,
  });
};

export const getDailyViewsStats = () => {
  return axiosInstance.get(`${apiurl}/getDailyViewsStats?timestamp=${new Date().getTime()}`);
};

export const getDailyCarAdditions = () => {
  return axiosInstance.get(`${apiurl}/getDailyCarAdditions?timestamp=${new Date().getTime()}`);
};

export const updateCarStatus = (carId, isSold) => {
  return axiosInstance.put(`${apiurl}/updateCarStatus/${carId}`, { isSold });
};