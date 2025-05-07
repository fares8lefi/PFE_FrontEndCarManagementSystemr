import axios from "axios";

const apiurl = "http://localhost:3003/users";

export async function getAllUsers() {
  return await axios.get(`${apiurl}/getAllUsers`,)
 
}

export async function addUserAdmin(formData) {
  return await axios.post(`${apiurl}/addUserAdmin`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
export async function searchUsers(query) {
  return await axios.get(`${apiurl}/searchUsers`, {
    params: { q: query }
  });
}

export const updateUserStatus = (userId, status) => {
  return axios.patch(`${apiurl}/updateUserStatus/${userId}/status`, { status });
};
export const deleteUser = (userId) => {
  return axios.delete(`${apiurl}/deleteUser/${userId}`);
};
export async function addUserClientImgOf(formData) {
  return await axios.post(
    `${apiurl}/addUserClientImgOf`, // Utilisez le chemin relatif
    formData
  );
}

export async function loginUser(formData) {
  return await axios.post(`${apiurl}/loginUser`, formData, {
    withCredentials: true, // Activer les cookies
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getUsersbyId() {
  return await axios.get(`${apiurl}/getUsersbyId`,
    {
      withCredentials: true, // Activer les cookies
    }
  );
}


export async function UpdateUserClientbyId(formData) {
  return await axios.put(`${apiurl}/UpdateUserClientbyId`, formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}


export async function logout() {
  return await axios.post(`${apiurl}/logout`,
    {
      withCredentials: true, // Activer les cookies
    }
  );
}


export async function changePassword(data) {
  return await axios.put(`${apiurl}/changePassword`, data, {
    withCredentials: true
  });
}