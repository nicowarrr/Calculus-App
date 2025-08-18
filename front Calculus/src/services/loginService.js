import axios from "axios";
import CryptoJS from 'crypto-js';

const API_URL = "http://174.129.53.237:3000/login"; 

const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
};

export const login = async (nickname, contrasena) => {
  try {
    const hashedPassword = hashPassword(contrasena);
    const response = await axios.post(API_URL, { 
      nickname, 
      contrasena: hashedPassword 
    });
    const userData = response.data;

    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error("Error en el login:", error);
    throw error;
  }
};
