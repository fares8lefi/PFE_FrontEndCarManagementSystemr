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
  return axios.put(`${apiurl}/UpdateCarById/${carId}`, updatedData, {
    withCredentials: true,
  });
};

export const getCarsByMarque = (marque) =>
  axios.get(`${apiurl}/getCarsByMarque`, { params: { marque } });

export const getCarsFiltered = (filters = {}) =>
  axios.get(`${apiurl}/getCarsFiltered`, { params: filters });



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
  return axiosInstance.get(`${apiurl}/getDailyViewsStats`);
};

export const getDailyCarAdditions = () => {
  return axiosInstance.get(`${apiurl}/getDailyCarAdditions`);
};