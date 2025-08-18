import axios from "axios";

const API_URL = "http://localhost:3000/accion";

export const accionService = async (accion,current_exercise) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const usuario_id = user?.id;

    if (!usuario_id) {
      throw new Error("Usuario no autenticado.");
    }
    const response = await axios.post(API_URL, {
      usuario_id,
      accion,
      current_exercise, // Include currentExercise
    });

    return response.data;
   
  } catch (error) {
    console.error("Error en el registro de accion:", error);
    throw error;
  }
};

