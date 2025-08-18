const { getAdminByUsername } = require("../data/adminData");

const loginAdmin = async (req, res) => {
  const { nickname, contrasena } = req.body;
  try {
    const admin = await getAdminByUsername(nickname);

    if (!admin) {
      return res.status(401).json();
    }

    console.log("Admin found:", admin.contraseña);

    if (contrasena!== admin.contraseña) {
      return res.status(401).json();
    }

    res.status(200).json(admin);

  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ message: "Error interno", error });
  }
};

module.exports = { loginAdmin };
