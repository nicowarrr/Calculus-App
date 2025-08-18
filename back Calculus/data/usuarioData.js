const pool = require("../config/db");
const bcrypt = require("bcrypt");

const createUsuario = async (
  nombre,
  correo,
  nickname,
  contrasena,
  timestamp
) => {
  const hashedPassword = await bcrypt.hash(contrasena, 10);
  const result = await pool.query(
    "INSERT INTO usuarios(nombre,correo, nickname,contraseña, creado_en) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [nombre, correo, nickname, hashedPassword, timestamp]
  );
  return result.rows[0];
};

const getUsuarios = async () => {
  const result = await pool.query("SELECT * FROM usuarios");
  return result.rows;
};

const loginUsuarios = async (nickname, contrasena) => {
  const result = await pool.query(
    "SELECT * FROM usuarios WHERE nickname = $1",
    [nickname]
  );
  if (result.rows.length > 0) {
    const usuario = result.rows[0];
    const match = await bcrypt.compare(contrasena, usuario.contraseña);
    if (match) {
      return usuario;
    }
  }
  return null; // Credenciales inválidas
};

const deleteUsuario = async (id) => {
  const result = await pool.query(
    "DELETE FROM usuarios WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

const updateUsuario = async (id, { nombre, correo, nickname, contrasena }) => {
  let hashedPassword = contrasena;
  if (contrasena) {
    hashedPassword = await bcrypt.hash(contrasena, 10);
  }
  const result = await pool.query(
    "UPDATE usuarios SET nombre = $1, correo = $2, nickname = $3, contraseña = $4 WHERE id = $5 RETURNING *",
    [nombre, correo, nickname, hashedPassword, id]
  );
  return result.rows[0];
};

module.exports = {
  createUsuario,
  loginUsuarios,
  getUsuarios,
  deleteUsuario,
  updateUsuario,
};
