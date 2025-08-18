import axios from "axios";

const API_URL = "http://localhost:3000/analisis";
const API_URL2 = "http://localhost:3000/analisis2";

export const analisisService = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const usuario_id = user?.id;

    if (!usuario_id) {
      throw new Error("Usuario no autenticado.");
    }
    const response = await axios.post(API_URL, {
      usuario_id, 
    });

    return response.data;
   
  } catch (error) {
    console.error("Error en el analisis:", error);
    throw error;
  }
};

export const getAnalisis = async (usuario_id) => {
  try {
    const response = await axios.post(API_URL2, { usuario_id });
    return response.data;
  } catch (error) {
    console.error("Error al obtener el analisis:", error);
    throw error;
  }
};