const {
  createResultado,
  getResultadosPorUsuario,
} = require("../data/resultadosData");

const addResultado = async (req, res) => {
  const { usuario_id, resultado_alumno, current_exercise } = req.body;
  try {
    const timestamp = new Date();
    console.log("Timestamp:", timestamp);
    let resultado_correcto;
    let estado_ejercicio = "malo";
    if (current_exercise == 1) {
      resultado_correcto =
        "C) \\( A = \\frac{40}{4 + \\pi},\\quad B = \\frac{20}{4 + \\pi} \\)";
      if (resultado_alumno === resultado_correcto) {
        estado_ejercicio = "bueno";
      }
    }
    if (current_exercise == 2) {
      resultado_correcto = "A) \\( f(x) = x^3 - 3x^2 + 2 \\)";
      if (resultado_alumno === resultado_correcto) {
        estado_ejercicio = "bueno";
      }
    }
    const ResultadoData = await createResultado(
      usuario_id,
      resultado_alumno,
      resultado_correcto,
      estado_ejercicio,
      current_exercise,
      timestamp
    );
    res.status(201).json(ResultadoData);
  } catch (error) {
    console.error("Error al agregar el resultado:", error);
    res.status(500).json({ error: "Error al agregar resultado" });
  }
};

const getResultadosUsuario = async (req, res) => {
  const { usuario_id } = req.body;
  try {
    const resultados = await getResultadosPorUsuario(usuario_id);
    res.status(200).json(resultados);
  } catch (error) {
    console.error("Error al obtener resultados del usuario:", error);
    res.status(500).json({ error: "Error al obtener resultados del usuario" });
  }
};

module.exports = {
  addResultado,
  getResultadosUsuario,
};
