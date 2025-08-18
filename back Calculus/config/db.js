const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  password: process.env.password,
  port: process.env.port,
  database: process.env.database,
   ssl: { rejectUnauthorized: false },
});


// Verificación de conexión sin consulta
pool.connect()
  .then(client => {
    console.log("✅ Conexión exitosa a la base de datos PostgreSQL");
    client.release(); // importante: liberar el cliente
  })
  .catch(err => {
    console.error("❌ Error de conexión:", err.stack);
  });

module.exports = pool;



