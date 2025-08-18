import axios from "axios";
import CryptoJS from 'crypto-js';


const API_URL = "http://174.129.53.237:3000/usuario"; 


const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
};

export const register = async (nombre, correo, nickname, contrasena) => {
  try {
    const hashedPassword = hashPassword(contrasena);
    const response = await axios.post(API_URL, {
      nombre,
      correo,
      nickname,
      contrasena: hashedPassword, // Enviar hash SHA256
    });
    return response.data;
  } catch (error) {
    console.error("Error en el registro:", error);
    throw error;
  }
};

//obtener todos los usuarios
export const getAllUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
};

// Eliminar un usuario por ID
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    throw error;
  }
};

// Editar un usuario por ID
export const editUser = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error al editar el usuario:", error);
    throw error;
  }
};
