import axiosInstance from './axiosConfig';

const apiurl = "/qrcode";

export async function getCarQRCode(carId) {
  try {
    const response = await axiosInstance.get(`${apiurl}/getCarQRCode/${carId}`);
    return response;
  } catch (error) {
    console.error('Erreur lors de la récupération du QR code:', error);
    throw error;
  }
}
