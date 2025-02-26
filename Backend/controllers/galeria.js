const { Galeria } = require('../models');
const cloudinary = require('../utils/cloudinary');


// 📌 Crear un registro en la galería
const crearImagenGaleria = async (req, res) => {
    const { titulo, descripcion, club_id, equipo_id } = req.body;

    try {
        if (!req.file) {
            return res.status(400).json({ msg: "No se ha subido ninguna imagen" });
        }

        // 📌 Subir imagen a Cloudinary
        const resultado = await cloudinary.uploader.upload(req.file.path, {
            folder: "galeria", // 📌 Carpeta en Cloudinary
        });

        // 📌 Crear el registro en la base de datos
        const nuevaImagen = await Galeria.create({
            titulo,
            descripcion,
            imagen_url: resultado.secure_url, // 📌 URL de Cloudinary
            club_id: club_id || null,
            equipo_id: equipo_id || null,
        });

        res.status(201).json({ msg: "Imagen subida correctamente", imagen: nuevaImagen });

    } catch (error) {
        console.error("❌ Error al subir imagen a la galería:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

// 📌 Obtener imágenes por Club ID
const obtenerGaleriaPorClub = async (req, res) => {
    const { club_id } = req.params;

    try {
        const imagenes = await Galeria.findAll({ where: { club_id } });
        res.status(200).json(imagenes);
    } catch (error) {
        console.error("❌ Error al obtener la galería del club:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

// 📌 Obtener imágenes por Equipo ID
const obtenerGaleriaPorEquipo = async (req, res) => {
    const { equipo_id } = req.params;

    try {
        const imagenes = await Galeria.findAll({ where: { equipo_id } });
        res.status(200).json(imagenes);
    } catch (error) {
        console.error("❌ Error al obtener la galería del equipo:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

module.exports = {
    crearImagenGaleria,
    obtenerGaleriaPorClub,
    obtenerGaleriaPorEquipo
};
