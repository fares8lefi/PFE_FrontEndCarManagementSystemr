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