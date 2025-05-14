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
// services/ApiComment.js
export async function deleteComment(commentId, carId) {
  return await axios.delete(
    `${apiurl}/deleteComment`,
    {
      data: { commentId, carId }, // Envoyer les données ici
      withCredentials: true
    }
  );
}

export async function updateComment(commentId, content) {
  return await axios.put(
    `${apiurl}/updateComment`,
    {
      commentId,
      content
    },
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}