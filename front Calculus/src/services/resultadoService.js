import axios from "axios";

const API_URL = "http://localhost:3000/resultado";

const API_URL2 = "http://localhost:3000/resultados-usuario";

export const resultadoService = async (resultado_alumno,current_exercise) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const usuario_id = user?.id;

    if (!usuario_id) {
      throw new Error("Usuario no autenticado.");
    }
    const response = await axios.post(API_URL, {
      usuario_id,
      resultado_alumno,
      current_exercise, // Include currentExercise
    });

    return response.data;
   
  } catch (error) {
    console.error("Error en el registro de accion:", error);
    throw error;
  }
};

export const getResultados= async (usuario_id) => {
  try {
    const response = await axios.post(API_URL2, { usuario_id });
    return response.data;
  } catch (error) {
    console.error("Error al obtener resultados:", error);
    throw error;
  }
};