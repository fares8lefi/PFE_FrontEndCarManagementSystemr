import axios from "axios";

const apiurl = "http://localhost:3000/newsLetter";

export async function addNewsLetter(newsLetter) {
    return await axios.post(`${apiurl}/addNewsLetter/`,newsLetter);
}