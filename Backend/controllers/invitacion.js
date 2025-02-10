const Invitacion = require('../models/invitacion');

// Función para generar claves aleatorias de 6 caracteres
const generarClaveAleatoria = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let clave = '';
    for (let i = 0; i < 6; i++) {
        clave += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return clave;
};

const generarInvitacion = async (req, res) => {
    const { equipo_id, rol_invitado, creator_id, extra_id, clave } = req.body;

    if (!equipo_id || !rol_invitado || !creator_id || !clave) {
        console.log(equipo_id, rol_invitado, creator_id, extra_id, clave)
        return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }


    try {

        const invitacion = await Invitacion.findOne({ where: { equipo_id } });

        if (invitacion){
            invitacion.active = false;
            await invitacion.save();
        }

        const nuevaInvitacion = await Invitacion.create({
            equipo_id,
            rol_invitado,
            usado: false,
            fecha_exp: new Date(new Date().setDate(new Date().getDate() + 1)), // Hoy + 1 día
            creator_id,
            extra_id: extra_id || null,
            clave,
            active: true
        });

        res.status(201).json({
            msg: "Invitación creada correctamente",
            clave: nuevaInvitacion.clave
        });
    } catch (error) {
        console.error("Error al crear la invitación:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};



const verificarInvitacion = async (req, res) => {
    const { clave } = req.params;

    try {
        const invitacion = await Invitacion.findOne({ where: { clave } });

        if (!invitacion) {
            return res.status(404).json({ msg: "Invitación no encontrada" });
        }

        res.status(200).json(invitacion);
    } catch (error) {
        console.error("Error al verificar la invitación:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};


const marcarInvitacionUsada = async (req, res) => {
    const { clave } = req.params;

    try {
        const invitacion = await Invitacion.findOne({ where: { clave } });

        if (!invitacion) {
            return res.status(404).json({ msg: "Invitación no encontrada" });
        }

        if (invitacion.usado) {
            return res.status(400).json({ msg: "La invitación ya ha sido utilizada" });
        }

        invitacion.usado = true;
        await invitacion.save();

        res.status(200).json({ msg: "Invitación marcada como usada" });
    } catch (error) {
        console.error("Error al actualizar la invitación:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};


const eliminarInvitacion = async (req, res) => {
    const { clave } = req.params;

    try {
        const resultado = await Invitacion.destroy({ where: { clave } });

        if (resultado === 0) {
            return res.status(404).json({ msg: "Invitación no encontrada" });
        }

        res.status(200).json({ msg: "Invitación eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar la invitación:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

const buscarInvitacionPorEquipo = async (req, res) => {
    const { equipo_id } = req.params;

    try {
        const invitaciones = await Invitacion.findAll({ where: { equipo_id, active: true } });

        if (invitaciones.length === 0) {
            return res.status(404).json({ msg: "No se han encontrado invitaciones" });
        }

        res.status(200).json(invitaciones);
    } catch (error) {
        console.error("Error al buscar las invitaciones:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
}

module.exports = {
    generarInvitacion,
    verificarInvitacion,
    marcarInvitacionUsada,
    eliminarInvitacion,
    buscarInvitacionPorEquipo
}


