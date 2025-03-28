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
