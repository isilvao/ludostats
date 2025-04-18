const express = require("express");
const equipoController = require("../controllers/equipos");
const multipart = require("connect-multiparty");

const md_auth = require("../middleware/authenticate");
const md_upload = multipart({ uploadDir: "./uploads/equipos" });
const md_team = require("../middleware/teamValidations");

const api = express.Router();

const multer = require("multer");

const { validarCreacionEquipo } = require("../middleware/validateMembership");


// 📌 Configuración de Multer para recibir imágenes
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Crear un equipo
// api.post("/nuevoequipo", [md_auth.asureAuth, md_upload], equipoController.crearEquipo);
api.post("/nuevoequipo", [md_auth.asureAuth, validarCreacionEquipo, upload.single("logo")], equipoController.crearEquipo);

// Modificar un equipo por su ID
//api.patch("/patchequipo/:id_equipo", [md_auth.asureAuth, md_upload, md_team.validateAdminOrGerenteInTeam], equipoController.modificarEquipo);
api.patch("/patchequipo/:id_equipo", equipoController.modificarEquipo);

// Eliminar un equipo por su ID
api.delete("/eliminarequipo/:id_equipo", equipoController.borrarEquipo);

// Obtener información completa de un equipo por su ID
api.get("/equipo/:id_equipo", [md_auth.asureAuth], equipoController.obtenerEquipoPorId);

// Obtener los equipos de un gerente
api.get("/misequipos", equipoController.obtenerMisEquipos);

// Obtener los equipos de un club
api.get("/equiposclub/:id_club", equipoController.obtenerEquiposClub);


api.patch(
  "/equipo_logo/:id",
  upload.single("logo"),
  equipoController.actualizarLogoEquipo
);

// Obtener todos los usuarios de un equipo pasado por params
api.get('/equipo/users/:id_equipo', equipoController.getUsersByTeam);
api.get('/equipo/user/:id_equipo/:id_usuario', equipoController.getUserByIdInTeam);


module.exports = api;
