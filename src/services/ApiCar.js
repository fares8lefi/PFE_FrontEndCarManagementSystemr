import axios from "axios";

const apiurl = "http://localhost:3000/cars";

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
  return axios.get(`${apiurl}/getUserCars`,  {
    withCredentials: true, //activations des cokkies
  });
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
  return axios.get(`${apiurl}/getLatestCars`,{
    withCredentials: true,
  });
};


export const getMonthlySalesStats = () => {
  return axios.get(`${apiurl}/getMonthlySalesStats`,{
    withCredentials: true,
  });
};

export const getPriceStatsByBrand = () => {
  return axios.get(`${apiurl}/getPriceStatsByBrand`,{
    withCredentials: true,
  });
};

export const getDailyViewsStats = () => {
  return axios.get(`${apiurl}/getDailyViewsStats`,{
    withCredentials: true,
  });
};

export const getCarsByYear = () => {
  return axios.get(`${apiurl}/getCarsByYear`,{
    withCredentials: true,
  });
};