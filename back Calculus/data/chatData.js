const pool = require("../config/db");

const createChat= async (usuario_id, mensaje_usuario, respuesta_chatbot, creado_en,currentExercise) => {
    const result = await pool.query(
      "INSERT INTO conversaciones (usuario_id,mensaje_usuario,respuesta_chatbot,creado_en,currentExercise) VALUES ($1, $2, $3, $4,$5) RETURNING *",
      [usuario_id, mensaje_usuario, respuesta_chatbot, creado_en,currentExercise]
    );
    return result.rows[0];
  };

  module.exports = {
    createChat
  };