const express = require("express");
const equipoController = require("../controllers/equipos");
const multipart = require("connect-multiparty");

const md_auth = require("../middleware/authenticate");
const md_upload = multipart({ uploadDir: "./uploads/equipos" });
const md_user = require("../middleware/userValidation");

const api = express.Router();

const multer = require("multer");

// 📌 Configuración de Multer para recibir imágenes
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Crear un equipo
api.post(
  "/nuevoequipo",
  [md_auth.asureAuth, md_upload, md_user.validateAdmin],
  equipoController.crearEquipo
);

// Modificar un equipo por su ID
api.patch(
  "/patchequipo/:id",
  [md_auth.asureAuth, md_upload, md_user.validateAdmin],
  equipoController.modificarEquipo
);

// Eliminar un equipo por su ID
api.delete(
  "/eliminarequipo/:id",
  [md_auth.asureAuth, md_user.validateAdmin],
  equipoController.borrarEquipo
);

// Obtener información completa de un equipo por su ID
api.get("/equipo/:id", equipoController.obtenerEquipoPorId);

// Obtener los equipos de un gerente
api.get("/misequipos", [md_auth.asureAuth], equipoController.obtenerMisEquipos);

api.get("/misequiposv2", equipoController.obtenerMisEquipos);

api.patch(
  "/equipo_logo/:id",
  upload.single("logo"),
  equipoController.actualizarLogoEquipo
);

module.exports = api;
