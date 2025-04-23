import axios from "axios";

const apiurl = "http://localhost:3000/contact";

export async function createMessage(message) {
    return await axios.post(`${apiurl}/createMessage`, message);
}


export async function getAllMessages() {
    return await axios.post(`${apiurl}/getAllMessages`);
}

export async function MarquerAsRead(id) {
    return await axios.put(`${apiurl}/MarquerAsRead/${id}`);
  }
