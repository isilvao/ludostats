const UsuariosEquipos = require('../models/UsuariosEquipos');
const Equipo = require('../models/Equipo');
const Usuario = require('../models/Usuario');
const Club = require("../models/Club");
const UsuarioClub = require('../models/UsuarioClub'); // Importar el modelo





const obtenerInfoEquipoYRol = async (req, res) => {
    const { equipo_id, usuario_id } = req.params;

    try {
        // 📌 1️⃣ Buscar el equipo y su club
        const equipo = await Equipo.findByPk(equipo_id, {
            include: [
                {
                    model: Club,
                    as: "club",
                }
            ]
        });

        if (!equipo) {
            return res.status(404).json({ msg: "Equipo no encontrado" });
        }

        // // 📌 2️⃣ Buscar si el usuario es gerente del club
        // const esGerente = equipo.club.gerente_id === usuario_id;

        // if (esGerente) {
        //     return res.status(200).json({
        //         equipo,
        //         club: equipo.club,
        //         rol: 4 // 📌 Número del rol de gerente
        //     });
        // }

        // 📌 3️⃣ Si no es gerente, buscar su rol en `UsuariosEquipos`
        const usuarioEquipo = await UsuariosEquipos.findOne({
            where: { usuario_id, equipo_id }
        });

        if (!usuarioEquipo) {
            return res.status(403).json({ msg: "El usuario no pertenece a este equipo" });
        }

        res.status(200).json({
            equipo,
            club: equipo.club,
            rol: usuarioEquipo.rol
        });

    } catch (error) {
        console.error("❌ Error al obtener la información del equipo y rol:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};




const obtenerInfoClubYRol = async (req, res) => {
    const { club_id, usuario_id } = req.params;

    try {
        // 📌 1️⃣ Buscar el club
        const club = await Club.findByPk(club_id);

        if (!club) {
            return res.status(404).json({ msg: "Club no encontrado" });
        }

        // 📌 2️⃣ Buscar el rol del usuario en la tabla UsuarioClub
        const usuarioClub = await UsuarioClub.findOne({
            where: { club_id, usuario_id }
        });

        let rol = "miembro"; // 📌 Valor por defecto

        if (usuarioClub) {
            // 📌 Si el rol es "gerente" o "administrador", mantenerlo
            const rolesPermitidos = ["gerente", "administrador", "admin"];
            rol = rolesPermitidos.includes(usuarioClub.rol) ? usuarioClub.rol : "miembro";
        }

        res.status(200).json({
            club,
            rol
        });

    } catch (error) {
        console.error("❌ Error al obtener la información del club y rol:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};


module.exports = {
    obtenerInfoClubYRol,
    obtenerInfoEquipoYRol

  };
