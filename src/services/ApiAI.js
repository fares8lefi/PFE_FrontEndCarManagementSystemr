import axios from "axios";



export async function blurCarPlate(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await axios.post(
    "http://localhost:5000/predict", 
    formData,
    { responseType: "blob" }
  );
  return response.data; 
}



/**
 * Vérifie si une image contient une voiture via l'API IA.
 * @param {File|Blob} imageFile
 * @returns {Promise<boolean>} true si une voiture est détectée, false sinon
 */
export async function detectCarInImage(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await axios.post(
    "http://127.0.0.1:5000/detect-car", // adapte l'URL si besoin
    formData
  );
  console.log("Réponse IA:", response.data);
  return response.data === true;
}