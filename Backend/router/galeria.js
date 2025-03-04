const express = require("express");

const api = express.Router();
const upload = require("../middleware/upload"); // 📌 Middleware para manejar imágenes
const galeriaController = require("../controllers/galeria");

// 📌 Crear una nueva imagen en la galería
api.post("/galeria", [upload.single("imagen")], galeriaController.crearImagenGaleria);

// 📌 Obtener imágenes de la galería por club
api.get("/galeria/club/:club_id", galeriaController.obtenerGaleriaPorClub);

// 📌 Obtener imágenes de la galería por equipo
api.get("/galeria/equipo/:equipo_id", galeriaController.obtenerGaleriaPorEquipo);

// 📌 Agregar la ruta para eliminar imagen de la galería
api.delete("/galeria/:id", galeriaController.eliminarImagenGaleria);


module.exports = api;
