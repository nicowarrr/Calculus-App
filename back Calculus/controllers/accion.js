const { createAccion } = require("../data/accionData");

const addAccion = async (req, res) => {
    const {usuario_id,accion,current_exercise} = req.body;
    try {
      const timestamp= new Date();
      console.log("Timestamp:", timestamp);
      const accionData = await createAccion(usuario_id,accion,current_exercise,timestamp);
      res.status(201).json(accionData);
    } catch (error) {
        console.error("Error al agregar el usuario:", error);
      res.status(500).json({ error: "Error al agregar la accion" });
    }
};

module.exports = {
    addAccion
};