import axios from "axios";
import { toast } from 'react-toastify';

/**
 * Floute la plaque d'immatriculation d'une image de voiture.
 * @param {File|Blob} imageFile - L'image à traiter
 * @returns {Promise<Blob>} L'image avec la plaque floutée
 */
export async function blurCarPlate(imageFile) {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axios.post(
      "http://localhost:5000/blur-plates",
      formData,
      { 
        responseType: "blob",
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Erreur lors du floutage:", error.message);
    throw new Error("Erreur lors du traitement de l'image");
  }
}

/**
 * Vérifie si une image contient une voiture via l'API IA.
 * @param {File|Blob} imageFile - L'image à analyser
 * @returns {Promise<{hasCar: boolean, confidence: number, details: any}>} Résultat de la détection
 */
export async function detectCarInImage(imageFile) {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    
    const response = await axios.post(
      "http://localhost:5000/detect-car",
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    // Analyser la réponse de l'IA
    const result = response.data;
    console.log("Réponse brute de l'IA:", result);

    // Vérifier si la réponse est un booléen ou une chaîne
    let hasCar = false;
    let details = result;

    if (typeof result === 'boolean') {
      hasCar = result;
    } else if (typeof result === 'string') {
      hasCar = result.toLowerCase().includes('car');
    }

    const confidence = hasCar ? 1.0 : 0.0;

    console.log("Analyse de la détection:", {
      has_car: hasCar,
      confidence: `${(confidence * 100).toFixed(1)}%`,
      details: result
    });

    return {
      hasCar,
      confidence,
      details: result
    };
  } catch (error) {
    console.error("Erreur lors de la détection:", error.message);
    throw new Error("Erreur lors de l'analyse de l'image");
  }
}