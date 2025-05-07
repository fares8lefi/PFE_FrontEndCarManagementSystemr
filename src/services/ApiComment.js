import axios from "axios";

const apiurl = "http://localhost:3003/comment";

export async function getCommentsByCar(id) {
    return await axios.get(`${apiurl}/getCommentsByCar/${id}`);
}

export async function addComment(carId, content) {
    return await axios.post(
      `${apiurl}/addComment`,
      { carId, content },
      {
        withCredentials: true
      }
    );
  }