import axios from "axios";

const API_URL = "http://localhost:3000/conversaciones";

export const getUserConversations = async (usuario_id) => {
  try {
    const response = await axios.post(API_URL, { usuario_id });
    return response.data;
  } catch (error) {
    console.error("Error al obtener las conversaciones:", error);
    throw error;
  }
};
