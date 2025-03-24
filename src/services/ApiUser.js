import axios  from "axios";

const apiurl='http://localhost:3000/users';

export async function getAllUsers() {
    return await axios.get(`${apiurl}/getAllUsers`)
}

export async function addUserClientImgOf(formData) {
    return await axios.post(
        `${apiurl}/addUserClientImgOf`, // Utilisez le chemin relatif
        formData
    );
}

export async function loginUser(formData) {
  return await axios.post(
    `${apiurl}/loginUser`,
    formData,
    {
      withCredentials: true, // Activer les cookies
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}