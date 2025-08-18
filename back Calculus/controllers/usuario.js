const {
  createUsuario,
  loginUsuarios,
  getUsuarios,
  deleteUsuario,
  updateUsuario,
} = require("../data/usuarioData");

const loginUsuario = async (req, res) => {
  const { nickname, contrasena } = req.body;
  try {
    const usuario = await loginUsuarios(nickname, contrasena);
    if (usuario) {
      res.status(200).json({
  id: usuario.id,
  nombre: usuario.nombre,
  nickname: usuario.nickname,
});
    } else {
      res.status(401).json();
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

const addUsuario = async (req, res) => {
  const { nombre, correo, nickname, contrasena } = req.body;
  try {
    const timestamp = new Date();
    console.log("Timestamp:", timestamp);
    const usuario = await createUsuario(
      nombre,
      correo,
      nickname,
      contrasena,
      timestamp
    );
    res.status(201).json({
  id: usuario.id,
  nombre: usuario.nombre,
  correo: usuario.correo,
  nickname: usuario.nickname,
  creado_en: usuario.creado_en
});
  } catch (error) {
    console.error("Error al agregar el usuario:", error);
    res.status(500).json({ error: error.message || "Error al agregar el usuario" });
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await getUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario_eliminado=await deleteUsuario(id);
    res.status(200).json(usuario_eliminado);
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};

const modificarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, nickname, contrasena } = req.body;
  try {
    const usuarioActualizado = await updateUsuario(id, {
      nombre,
      correo,
      nickname,
      contrasena,
    });
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    console.error("Error al modificar el usuario:", error);
    res.status(500).json({ error: "Error al modificar el usuario" });
  }
};

module.exports = {
  addUsuario,
  loginUsuario,
  obtenerUsuarios,
  eliminarUsuario,
  modificarUsuario,
};
