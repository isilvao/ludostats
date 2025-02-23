const Equipo = require("../models/Equipo");
const Usuario = require("../models/Usuario");
const Club = require("../models/Club");
const UsuariosEquipos = require("../models/UsuariosEquipos");
const { Op } = require("sequelize"); // 📌 Importamos operadores de Sequelize
const cloudinary = require('../utils/cloudinary');
const { UsuarioClub } = require("../models");

// const crearEquipo = async (req, res) => {
//     const { nombre, club_id, nivelPractica, descripcion } =
//         req.body;
//     const { user_id } = req.user;

//     if (!nombre || !club_id || !nivelPractica) {
//         return res.status(400).json({ msg: "Faltan datos obligatorios" });
//     }

//     try {
//         // TODO: Arreglar funcionalidades del logo
//         /**
//         let imagePath = null

//         if (req.files.logo) {
//             imagePath = image.getFilePath(req.files.logo)
//         }
//         */

//         const nuevoEquipo = await Equipo.create({
//             nombre,
//             descripcion: descripcion,
//             club_id,
//             nivelPractica,
//         });

//         const usuariosEquipos = await UsuariosEquipos.create({
//             usuario_id: user_id,
//             equipo_id: nuevoEquipo.id,
//             rol: 'gerente'
//         })

//         if (!nuevoEquipo || !usuariosEquipos) {
//             return res.status(400).json({ msg: "Error al crear el equipo" });
//         } else {
//             return res.status(201).json({ msg: "Equipo creado correctamente", equipo: nuevoEquipo });
//         }
//     } catch (error) {
//         return res.status(500).json({ msg: "Error interno del servidor" });
//     }
// };



const crearEquipo = async (req, res) => {
    try {
        const { nombre, club_id, nivelPractica, descripcion } = req.body;
        const { user_id } = req.user;

        if (!nombre || !club_id || !nivelPractica) {
            return res.status(400).json({ msg: "Faltan datos obligatorios" });
        }

        // 📌 Subir imagen a Cloudinary si se proporciona
        let logoUrl = null;
        if (req.file) {
            const resultado = await cloudinary.uploader.upload(req.file.path, {
                folder: "equipos",
                public_id: `equipo_${nombre.replace(/ /g, "_")}`,
                overwrite: true
            });
            logoUrl = resultado.secure_url; // 📌 Guardamos la URL de Cloudinary
        }

        // 📌 Crear el equipo en la BD
        const nuevoEquipo = await Equipo.create({
            nombre,
            descripcion,
            club_id,
            nivelPractica,
            logo: logoUrl
        });

        // 📌 Asignar al usuario como gerente del equipo
        const usuariosEquipos = await UsuariosEquipos.create({
            usuario_id: user_id,
            equipo_id: nuevoEquipo.id,
            rol: 'gerente'
        });

        if (!nuevoEquipo || !usuariosEquipos) {
            return res.status(400).json({ msg: "Error al crear el equipo" });
        }

        // 📌 Devolver la URL del logo si se subió
        res.status(200).json({
            msg: "Equipo creado correctamente",
            equipo: {
                id: nuevoEquipo.id,
                nombre: nuevoEquipo.nombre,
                descripcion: nuevoEquipo.descripcion,
                club_id: nuevoEquipo.club_id,
                nivelPractica: nuevoEquipo.nivelPractica,
                logo: nuevoEquipo.logo // 📌 Devuelve la URL del logo
            }
        });

    } catch (error) {
        console.error("❌ Error al crear el equipo:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};


const modificarEquipo = async (req, res) => {
    const { id_equipo } = req.params;
    const datosActualizados = req.body;

    try {
        const equipo = await Equipo.findByPk(id_equipo);

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
    const { id_equipo } = req.params;

    try {
        const resultado = await Equipo.destroy({ where: { id: id_equipo } });

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
    const { id_equipo } = req.params;

    try {
        const equipo = await Equipo.findByPk(id_equipo);
        console.log(id_equipo)
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
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ msg: "Falta el parámetro user_id" });
    }

    try {
        // 📌 1️⃣ Equipos donde el usuario está registrado en UsuariosEquipos
        const equipos = await UsuariosEquipos.findAll({
            where: { usuario_id: user_id },
            include: [{ model: Equipo, as: "equipo", include: [{ model: Club, as: "club" }] }],
        });

        respuesta = equipos.map((team) => {

            const response = UsuariosEquipos.findOne({ where: { equipo_id: team.equipo.id, rol: 'entrenador' } })

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
                rol: team.rol
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

const getUsersByTeam = async (req, res) => {
    const { id_equipo } = req.params;

    try {
        const users = await UsuariosEquipos.findAll({
            where: { equipo_id: id_equipo },
            include: [
                {
                    model: Usuario,
                    as: "usuario",
                    attributes: ["id", "nombre", "apellido", "correo", "acudiente_id"],
                    include: [
                        {
                            model: Usuario,
                            as: "acudiente",
                            attributes: ["correo"],
                        }
                    ]
                }
            ]
        });

        // 📌 Transformamos los datos antes de enviarlos en la respuesta
        const formattedUsers = await Promise.all(users.map(async (user) => {
            let usuarioData = user.usuario.toJSON();  // Convertimos a objeto manipulable

            // 📌 Buscar en UsuarioClub si el usuario está activado en el club correspondiente
            const usuarioClub = await UsuarioClub.findOne({
                where: { usuario_id: usuarioData.id },
                attributes: ["activado"]
            });

            let activado = usuarioClub ? usuarioClub.activado : false;

            // 📌 Si es "miembro" o tiene un acudiente, cambiamos la info
            if (user.rol === "miembro" || usuarioData.acudiente_id) {
                usuarioData.correo = usuarioData.acudiente ? usuarioData.acudiente.correo : usuarioData.correo;
                user.rol = "deportista";
            }

            return {
                id: user.id,
                equipo_id: user.equipo_id,
                usuario: {
                    id: usuarioData.id,
                    nombre: usuarioData.nombre,
                    apellido: usuarioData.apellido,
                    correo: usuarioData.correo,
                    activo: activado // ✅ Se agrega el estado de activación del usuario
                },
                rol: user.rol
            };
        }));

        res.status(200).json(formattedUsers);
    } catch (error) {
        console.error("❌ Error al obtener los usuarios del equipo:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

const getUserByIdInTeam = async (req, res) => {
    const { id_equipo, id_usuario } = req.params;

    try {

        const user = await UsuariosEquipos.findOne({
            where: { equipo_id: id_equipo, usuario_id: id_usuario },
            include: [
                {
                    model: Usuario,
                    as: "usuario",
                }
            ]
        })

        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado en el equipo" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error al obtener el usuario del equipo:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
}

module.exports = {
    crearEquipo,
    modificarEquipo,
    borrarEquipo,
    obtenerEquipoPorId,
    obtenerMisEquipos,
    actualizarLogoEquipo,
    getUsersByTeam,
    getUserByIdInTeam
};
