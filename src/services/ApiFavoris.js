import axios from "axios";
import axiosInstance from './axiosConfig';

const apiurl = "/favoris";

export async function getUserFavorites() {
  return await axiosInstance.get(`${apiurl}/getUserFavorites`);
}

export async function addCarToFavorites(carId) {
    return await axiosInstance.post(`${apiurl}/addCarToFavorites`,{carId},
        {
            withCredentials: true,
        }
    );
}

export async function deleteFavoris(favoriId) {
    return await axiosInstance.delete(`${apiurl}/deleteFavoris`, {
        data: { carId: favoriId }
    });
}
