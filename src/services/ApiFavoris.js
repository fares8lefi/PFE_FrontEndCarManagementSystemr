import axios from "axios";
import axiosInstance from './axiosConfig';

const apiurl = "/favoris";

export async function getUserFavorites() {
  return await axiosInstance.get(`${apiurl}/getUserFavorites`);
}

export async function addCarToFavorites(carId) {
    return await axios.post(`${apiurl}/addCarToFavorites`,{carId},
        {
            withCredentials: true,
        }
    );
}

export async function deleteFavoris(favoriId) {
    return await axios.delete(`${apiurl}/deleteFavoris`, {
        data: { carId: favoriId },  // Envoyer les données dans "data" pour une requête DELETE
        withCredentials: true,
    });
}
