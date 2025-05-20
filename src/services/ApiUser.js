import axios from "axios";
import axiosInstance from './axiosConfig';

const apiurl = "/users";

export async function getAllUsers() {
  return await axiosInstance.get(`${apiurl}/getAllUsers`);
}

export async function addUserAdmin(formData) {
  return await axiosInstance.post(`${apiurl}/addUserAdmin`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
export async function searchUsers(query) {
  return await axiosInstance.get(`${apiurl}/searchUsers`, {
    params: { q: query }
  });
}

export const updateUserStatus = (userId, status) => {
  return axiosInstance.patch(`${apiurl}/updateUserStatus/${userId}/status`, { status });
};
export const deleteUser = (userId) => {
  return axiosInstance.delete(`${apiurl}/deleteUser/${userId}`);
};
export async function addUserClientImgOf(formData) {
  return await axiosInstance.post(
    `${apiurl}/addUserClientImgOf`, // Utilisez le chemin relatif
    formData
  );
}

export async function loginUser(formData) {
  return await axiosInstance.post(`${apiurl}/loginUser`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getUsersbyId() {
  return await axiosInstance.get(`${apiurl}/getUsersbyId`);
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
  return await axiosInstance.post(`${apiurl}/logout`);
}

export async function changePassword(data) {
  return await axiosInstance.put(`${apiurl}/changePassword`, data);
}

export async function forgotPassword(email) {
  return await axiosInstance.post(`${apiurl}/forgotPassword`, { email });
}

export async function verifyResetCode(email, resetCode) {
  return await axiosInstance.post(`${apiurl}/verifyResetCode`, {
    email: email,
    code: resetCode
  });
}

export async function resetPassword(email, resetCode, newPassword) {
  if (!email || !resetCode || !newPassword) {
    throw new Error('Email, code et nouveau mot de passe sont requis');
  }

  return await axiosInstance.post(`${apiurl}/resetPassword`, {
    email: email.trim(),
    code: resetCode.trim(),
    newPassword: newPassword.trim()
  });
}