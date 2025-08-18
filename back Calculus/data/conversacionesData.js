const pool = require("../config/db");

const getConversaciones= async (usuario_id) => {
    const result = await pool.query(
        "SELECT * FROM conversaciones WHERE usuario_id = $1",
        [usuario_id]
      );
    
    return result.rows;
  };

module.exports = {
    getConversaciones
};