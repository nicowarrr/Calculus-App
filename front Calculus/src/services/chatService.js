import axios from "axios";

const API_URL = "http://localhost:3000/chat";

export const sendMessage = async (
  mensaje_usuario,
  conversationId,
  currentExercise
) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const usuario_id = user?.id;

    if (!usuario_id) {
      throw new Error("Usuario no autenticado.");
    }

    const response = await axios.post(API_URL, {
      mensaje_usuario,
      conversationId,
      usuario_id,
      currentExercise, // Include currentExercise
    });

    return response.data;
  } catch (error) {
    console.error("Error en el chat:", error);
    throw error;
  }
};
