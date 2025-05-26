import axios from "axios";
import axiosInstance from './axiosConfig';

// Définir l'URL de base de l'API
const BASE_URL = "http://localhost:3004";
const apiurl = "/users"; // Retirer BASE_URL car il est déjà dans axiosConfig

export async function getAllUsers() {
  try {
    return await axiosInstance.get(`${apiurl}/getAllUsers`);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw error;
  }
}

export async function addUserAdmin(formData) {
  try {
    return await axiosInstance.post(`${apiurl}/addUserAdmin`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un admin:', error);
    throw error;
  }
}

export async function searchUsers(query) {
  try {
    return await axiosInstance.get(`${apiurl}/searchUsers`, {
      params: { q: query }
    });
  } catch (error) {
    console.error('Erreur lors de la recherche des utilisateurs:', error);
    throw error;
  }
}

export const updateUserStatus = async (userId, status) => {
  try {
    return await axiosInstance.patch(`${apiurl}/updateUserStatus/${userId}/status`, { status });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    return await axiosInstance.delete(`${apiurl}/deleteUser/${userId}`);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    throw error;
  }
};

export async function singUpUser(formData) {
  try {
    console.log('Tentative d\'inscription avec les données:', formData);
    const response = await axiosInstance.post(
      `${apiurl}/singUpUser`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    console.log('Réponse du serveur:', response);
    return response;
  } catch (error) {
    console.error('Erreur détaillée lors de l\'inscription:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config
    });
    throw error;
  }
}

export async function loginUser(formData) {
  try {
    return await axiosInstance.post(`${apiurl}/loginUser`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
}

export async function getUsersbyId() {
  try {
    return await axiosInstance.get(`${apiurl}/getUsersbyId`);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    throw error;
  }
}

export async function UpdateUserClientbyId(formData) {
  try {
    return await axiosInstance.put(`${apiurl}/UpdateUserClientbyId`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    throw error;
  }
}

export async function logout() {
  try {
    return await axiosInstance.post(`${apiurl}/logout`);
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    throw error;
  }
}

export async function changePassword(data) {
  try {
    return await axiosInstance.put(`${apiurl}/changePassword`, data);
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    throw error;
  }
}

export async function forgotPassword(email) {
  try {
    return await axiosInstance.post(`${apiurl}/forgotPassword`, { email });
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation:', error);
    throw error;
  }
}

export async function verifyResetCode(email, resetCode) {
  try {
    return await axiosInstance.post(`${apiurl}/verifyResetCode`, {
      email: email,
      code: resetCode
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du code:', error);
    throw error;
  }
}

export async function resetPassword(email, resetCode, newPassword) {
  try {
    if (!email || !resetCode || !newPassword) {
      throw new Error('Email, code et nouveau mot de passe sont requis');
    }

    return await axiosInstance.post(`${apiurl}/resetPassword`, {
      email: email.trim(),
      code: resetCode.trim(),
      newPassword: newPassword.trim()
    });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    throw error;
  }
}

export async function verifyAccount(email, verificationCode) {
  try {
    if (!email || !verificationCode) {
      throw new Error('Email et code de vérification sont requis');
    }

    return await axiosInstance.post(`${apiurl}/verifyAccount`, {
      email: email.trim(),
      code: verificationCode.trim()
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du compte:', error);
    throw error;
  }
}