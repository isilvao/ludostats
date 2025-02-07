const express = require("express");
const usuariosEquiposController = require("../controllers/usuariosEquipos");
const userController = require("../controllers/user");

const api = express.Router();

api.post("/usuarios-equipos", usuariosEquiposController.crearUsuarioEquipo);
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

module.exports = api;
