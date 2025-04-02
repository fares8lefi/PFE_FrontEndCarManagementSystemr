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

