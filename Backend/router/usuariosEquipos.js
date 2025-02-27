const express = require("express");
const usuariosEquiposController = require("../controllers/usuariosEquipos");
const userController = require("../controllers/user");

const api = express.Router();
const { validarUnionEquipo } = require("../middleware/validateMembership");




api.post("/usuarios-equipos", [validarUnionEquipo],usuariosEquiposController.crearUsuarioEquipo);


api.patch(
  "/usuarios-equipos/:id",
  usuariosEquiposController.modificarUsuarioEquipo
);
api.delete(
  "/usuarios-equipos/:id",
  usuariosEquiposController.borrarUsuarioEquipo
);
// api.patch('/usuarios/:usuarioId/asignar-acudiente', usuariosEquiposController.asignarAcudiente);

api.patch(
  "/equipos/:equipoId/entrenador",
  usuariosEquiposController.asignarEntrenadorAEquipo
);

api.delete(
  "/usuarios-equipos/:usuarioId/:equipoId",
  usuariosEquiposController.borrarUsuarioEquipo
);

// 📌 Ruta para obtener los clubes de un usuario
api.get(
  "/usuarios-equipos/:usuario_id/clubes",
  userController.buscarClubesUsuario
);

// 📌 Ruta para modificar el rol de un usuario en un equipo
api.patch('/usuario_equipo/rol/:usuario_id/:equipo_id', usuariosEquiposController.modificarRolUsuarioEquipo);
api.patch('/usuario_club/rol/:usuario_id/:club_id', usuariosEquiposController.modificarRolUsuarioClub);

module.exports = api;
