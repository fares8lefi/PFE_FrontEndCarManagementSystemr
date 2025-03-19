import axios from "axios";

const apiurl = "http://localhost:3000/comment";

export async function getCommentsByCar(id) {
    return await axios.get(`${apiurl}/getCommentsByCar/${id}`);
}