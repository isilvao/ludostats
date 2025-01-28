const express = require("express");
const equipoController = require("../controllers/equipos");

const api = express.Router();

// Crear un equipo
api.post("/equipos", equipoController.crearEquipo);

// Modificar un equipo por su ID
api.patch("/equipos/:id", equipoController.modificarEquipo);

// Eliminar un equipo por su ID
api.delete("/equipos/:id", equipoController.borrarEquipo);

// Obtener información completa de un equipo por su ID
api.get("/equipos/:id", equipoController.obtenerEquipoPorId);

module.exports = api;

