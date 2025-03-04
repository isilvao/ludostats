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




// 📌 Eliminar una imagen de la galería por ID
const eliminarImagenGaleria = async (req, res) => {
    const { id } = req.params;

    try {
        // 📌 Buscar la imagen en la base de datos
        const imagen = await Galeria.findByPk(id);

        if (!imagen) {
            return res.status(404).json({ msg: "Imagen no encontrada" });
        }

        // 📌 Extraer el `public_id` de Cloudinary desde la URL
        const urlPartes = imagen.imagen_url.split("/");
        const publicIdConExtension = urlPartes[urlPartes.length - 1]; // Última parte de la URL
        const publicId = `galeria/${publicIdConExtension.split(".")[0]}`; // Remueve la extensión

        // 📌 Eliminar la imagen de Cloudinary
        await cloudinary.uploader.destroy(publicId);

        // 📌 Eliminar el registro en la base de datos
        await imagen.destroy();

        res.status(200).json({ msg: "Imagen eliminada correctamente", id });

    } catch (error) {
        console.error("❌ Error al eliminar la imagen de la galería:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};


module.exports = {
    crearImagenGaleria,
    obtenerGaleriaPorClub,
    obtenerGaleriaPorEquipo,
    eliminarImagenGaleria
};
