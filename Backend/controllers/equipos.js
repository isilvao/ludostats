const Equipo = require("../models/Equipo");
const Usuario = require("../models/Usuario");
const Club = require("../models/Club");
const UsuariosEquipos = require("../models/UsuariosEquipos");
const { Op } = require("sequelize"); // 📌 Importamos operadores de Sequelize
const cloudinary = require('../utils/cloudinary');
const { UsuarioClub } = require("../models");

const crearEquipo = async (req, res) => {
    const { nombre, club_id, entrenador_id = null, nivelPractica, descripcion } =
        req.body;
    const {user_id} = req.user;

    if (!nombre || !club_id || !nivelPractica) {
        return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }

    try {

        let imagePath = null

        if (req.files.logo){
            imagePath = image.getFilePath(req.files.logo)
        }

        const nuevoEquipo = await Equipo.create({
            nombre,
            logo: imagePath,
            descripcion: descripcion,
            club_id,
            nivelPractica,
        });

        const usuariosEquipos = await UsuariosEquipos.create({
            usuario_id: user_id,
            equipo_id: nuevoEquipo.id,
            rol: 'gerente'
        })

        if (!nuevoEquipo || !usuariosEquipos) {
            return res.status(400).json({ msg: "Error al crear el equipo" });
        } else if (entrenador_id === null) {
            return res.status(201).json({ msg: "Equipo creado correctamente", equipo: nuevoEquipo });
        } else {
            const usuario = await Usuario.findByPk(entrenador_id);

            if (!usuario) {
                return res.status(404).json({ msg: "Usuario no encontrado" });
            }

            await UsuariosEquipos.create({
                usuario_id: entrenador_id,
                equipo_id: nuevoEquipo.id,
                rol: 'entrenador', // 2 = Entrenador
            }).then((response) => {
                return res.status(201).json({ msg: "Equipo creado correctamente", equipo: nuevoEquipo });
            }).catch((error) => {
                console.error("Error al registrar el entrenador en el equipo:", error);
                return res.status(500).json({ msg: "Error interno del servidor" });
            })
        }
    } catch (error) {
        console.error("Error al crear el equipo:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

const modificarEquipo = async (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;

    try {
        const equipo = await Equipo.findByPk(id);

        if (!equipo) {
        return res.status(404).json({ msg: "Equipo no encontrado" });
        }

        await equipo.update(datosActualizados);

        res.status(200).json({ msg: "Equipo actualizado correctamente", equipo });
    } catch (error) {
        console.error("Error al modificar el equipo:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

const borrarEquipo = async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await Equipo.destroy({ where: { id } });

        if (!resultado) {
        return res.status(404).json({ msg: "Equipo no encontrado" });
        }

        res.status(200).json({ msg: "Equipo eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el equipo:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};


const obtenerEquipoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const equipo = await Equipo.findByPk(id);
        console.log(id)
        if (!equipo) {
            return res.status(404).json({ msg: "Equipo no encontrado" });
        }

        res.status(200).json(equipo);
    } catch (error) {
        console.error("Error al obtener el equipo:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};


const obtenerMisEquipos = async (req, res) => {
    const { user_id } = req.user;

    if (!user_id) {
        return res.status(400).json({ msg: "Falta el parámetro user_id" });
    }

    try {
        // 📌 1️⃣ Equipos donde el usuario está registrado en UsuariosEquipos
        const equipos = await UsuariosEquipos.findAll({
            where: { usuario_id: user_id },
            include: [{ model: Equipo, as: "equipo", include: [{ model: Club, as: "club" }] }],
        });

        console.log(equipos)

        respuesta = equipos.map((team) => {

            const response = UsuariosEquipos.findOne({where: {equipo_id: team.equipo.id, rol: 'entrenador'}})

            return {
                id: team.equipo.id,
                nombre: team.equipo.nombre,
                descripcion: team.equipo.descripcion,
                nivelPractica: team.equipo.nivelPractica,
                logo: team.equipo.logo,
                entrenador_id: response.usuario_id || null,
                club_id: team.equipo.club.id,
                createdAt: team.equipo.createdAt,
                updatedAt: team.equipo.updatedAt,
                club: {
                    id: team.equipo.club.id,
                    nombre: team.equipo.club.nombre,
                    deporte: team.equipo.club.deporte,
                    telefono: team.equipo.club.telefono,
                    logo: team.equipo.club.logo,
                    createdAt: team.equipo.club.createdAt,
                    updatedAt: team.equipo.club.updatedAt,
                },
            };
        })


        res.status(200).json(respuesta);
    } catch (error) {
        console.error("❌ Error al obtener los equipos:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

const actualizarLogoEquipo = async (req, res) => {
    const { id } = req.params;

    if (!req.file) {
        return res.status(400).json({ msg: "No se subió ninguna imagen" });
    }

    try {
        // 📌 Subir imagen a Cloudinary
        const resultado = await cloudinary.uploader.upload(req.file.path, {
            folder: "equipos_logos",
            resource_type: "image"
        });

        // 📌 Actualizar el equipo con la URL de la imagen
        const equipo = await Equipo.findByPk(id);
        if (!equipo) {
            return res.status(404).json({ msg: "Equipo no encontrado" });
        }

        equipo.logo = resultado.secure_url;
        await equipo.save();

        res.status(200).json({ msg: "Logo del equipo actualizado", logo: resultado.secure_url });
    } catch (error) {
        console.error("❌ Error al actualizar el logo del equipo:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};


module.exports = {
    crearEquipo,
    modificarEquipo,
    borrarEquipo,
    obtenerEquipoPorId,
    obtenerMisEquipos,
    actualizarLogoEquipo
};
