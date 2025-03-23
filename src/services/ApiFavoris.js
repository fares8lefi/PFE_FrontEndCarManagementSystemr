import axios from "axios";

const apiurl = "http://localhost:3000/favoris"; 

export async function getUserFavorites(id) {
    return await axios.get(`${apiurl}/getUserFavorites/${id}`);
}