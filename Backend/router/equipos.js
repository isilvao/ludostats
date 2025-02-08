const express = require("express");
const equipoController = require("../controllers/equipos");
const multipart = require("connect-multiparty");

const md_auth = require("../middleware/authenticate");
const md_upload = multipart({ uploadDir: "./uploads/equipos" });
const md_team = require("../middleware/teamValidations");

const api = express.Router();

const multer = require("multer");

// 📌 Configuración de Multer para recibir imágenes
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Crear un equipo
api.post("/nuevoequipo",[md_auth.asureAuth, md_upload],equipoController.crearEquipo);

// Modificar un equipo por su ID
api.patch("/patchequipo/:id_equipo",[md_auth.asureAuth, md_upload, md_team.validateAdminOrGerenteInTeam],equipoController.modificarEquipo);

// Eliminar un equipo por su ID
api.delete("/eliminarequipo/:id_equipo",[md_auth.asureAuth, md_team.validateAdminOrGerenteInTeam],equipoController.borrarEquipo);

// Obtener información completa de un equipo por su ID
api.get("/equipo/:id_equipo",[md_auth.asureAuth, md_team.validateAdminOrGerenteInTeam],equipoController.obtenerEquipoPorId);

// Obtener los equipos de un gerente
api.get("/misequipos", [md_auth.asureAuth], equipoController.obtenerMisEquipos);

api.get("/misequiposv2", equipoController.obtenerMisEquipos);

api.patch(
  "/equipo_logo/:id",
  upload.single("logo"),
  equipoController.actualizarLogoEquipo
);

module.exports = api;
