const express = require("express");
const equipoController = require("../controllers/equipos");

const api = express.Router();

api.post("/equipos", equipoController.crearEquipo);
api.patch("/equipos/:id", equipoController.modificarEquipo);
api.delete("/equipos/:id", equipoController.borrarEquipo);

module.exports = api;
