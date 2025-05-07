import axios from "axios";

const apiurl = "http://localhost:3003/favoris"; 

export async function getUserFavorites() {
    return await axios.get(`${apiurl}/getUserFavorites`, {
      withCredentials: true 
    });
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
