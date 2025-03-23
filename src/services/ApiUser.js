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