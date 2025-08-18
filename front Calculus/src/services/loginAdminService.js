import axios from "axios";

const API_URL = "http://localhost:3000/admin";

export const login = async (nickname, contrasena) => {
  try {
    const response = await axios.post(API_URL, { nickname, contrasena });
    const adminData = response.data;

    return adminData;
  } catch (error) {
    console.error("Error en el login:", error);
    throw error;
  }
};