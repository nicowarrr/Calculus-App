const pool = require("../config/db");

const getAdminByUsername = async (username) => {
  try {
    const query = "SELECT * FROM admin WHERE nickname = $1";
    const values = [username];
    console.log(username)
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }
    console.log("Admin found:", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching admin by username:", error);
    throw error;
  }
};

module.exports = { getAdminByUsername };
