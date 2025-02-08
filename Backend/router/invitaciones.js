const express = require("express");
const invitacionController = require("../controllers/invitacion");

const api = express.Router();


// Invitaciones
api.post("/invitaciones", invitacionController.generarInvitacion);
api.get("/invitaciones/:clave", invitacionController.verificarInvitacion);
api.patch("/invitaciones/:clave/usar",invitacionController.marcarInvitacionUsada);
api.delete("/invitaciones/:clave", invitacionController.eliminarInvitacion);

module.exports = api;