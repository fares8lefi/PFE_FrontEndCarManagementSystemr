import axios from "axios";

const apiurl = "http://localhost:3000/favoris"; 

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

