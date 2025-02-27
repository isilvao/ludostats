const Usuario = require('../models/Usuario');
const UsuarioClub = require('../models/UsuarioClub');
const UsuariosEquipos = require('../models/UsuariosEquipos');
const TipoEstadistica = require('../models/TipoEstadistica');

const MEMBERSHIP_LIMITS = {
    gratis: { clubes: 1, equipos: 2, estadisticas: 2, miembros: 10 },
    basico: { clubes: 1, equipos: 5, estadisticas: 10, miembros: 50 },
    premium: { clubes: 3, equipos: 15, estadisticas: 30, miembros: 150 },
    pro: { clubes: 5, equipos: 30, estadisticas: 50, miembros: 300 },
};

/**
 * 📌 Middleware para validar la cantidad de clubes que un usuario puede crear según su membresía.
 */
const validarCreacionClub = async (req, res, next) => {
    try {
        const { user_id } = req.user;

        const usuario = await Usuario.findByPk(user_id);
        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

        const limiteClubes = MEMBERSHIP_LIMITS[usuario.tipo_suscripcion].clubes;

        const cantidadClubes = await UsuarioClub.count({
            where: { usuario_id: user_id, rol: 'gerente' }
        });

        if (cantidadClubes >= limiteClubes) {
            return res.status(403).json({ msg: "Has alcanzado el límite de clubes permitidos en tu plan." });
        }

        next();
    } catch (error) {
        console.error("❌ Error en validación de creación de club:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

/**
 * 📌 Middleware para validar la cantidad de equipos que un usuario puede crear según su membresía.
 */
const validarCreacionEquipo = async (req, res, next) => {
    try {
        const { user_id } = req.user;

        const usuario = await Usuario.findByPk(user_id);
        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

        const limiteEquipos = MEMBERSHIP_LIMITS[usuario.tipo_suscripcion].equipos;

        const cantidadEquipos = await UsuariosEquipos.count({
            where: { usuario_id: user_id, rol: 'gerente' }
        });

        if (cantidadEquipos >= limiteEquipos) {
            return res.status(403).json({ msg: "Has alcanzado el límite de equipos permitidos en tu plan." });
        }

        next();
    } catch (error) {
        console.error("❌ Error en validación de creación de equipo:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

/**
 * 📌 Middleware para validar la cantidad de tipos de estadísticas que un usuario puede crear según su membresía.
 */
const validarCreacionEstadistica = async (req, res, next) => {
    try {
        const { user_id } = req.user;

        // 📌 Buscar al usuario
        const usuario = await Usuario.findByPk(user_id);
        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

        // 📌 Determinar el límite según el tipo de suscripción
        const limiteEstadisticas = MEMBERSHIP_LIMITS[usuario.tipo_suscripcion].estadisticas;

        // 📌 Buscar los clubes donde el usuario es gerente
        const clubesUsuario = await UsuarioClub.findAll({
            where: { usuario_id: user_id, rol: "gerente" },
            attributes: ["club_id"]
        });

        const clubesIds = clubesUsuario.map(c => c.club_id);

        // 📌 Contar todas las estadísticas en los clubes donde el usuario es gerente
        const cantidadEstadisticas = await TipoEstadistica.count({
            where: { club_id: clubesIds }
        });

        // 📌 Validar si supera el límite
        if (cantidadEstadisticas >= limiteEstadisticas) {
            return res.status(403).json({ msg: "Has alcanzado el límite de tipos de estadísticas permitidos en tu plan." });
        }

        next();
    } catch (error) {
        console.error("❌ Error en validación de creación de estadísticas:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};


/**
 * 📌 Middleware para validar la cantidad de deportistas/mienbros en los clubes del usuario gerente.
 */
const validarUnionEquipo = async (req, res, next) => {
    try {
        const { user_id } = req.user;

        const usuario = await Usuario.findByPk(user_id);
        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

        const limiteMiembros = MEMBERSHIP_LIMITS[usuario.tipo_suscripcion].miembros;

        // Contar miembros en clubes donde el usuario es gerente
        const miembrosAsociados = await UsuarioClub.count({
            where: { club_id: usuario.id, rol: ['deportista', 'miembro'] }
        });

        if (miembrosAsociados >= limiteMiembros) {
            return res.status(403).json({ msg: "Has alcanzado el límite de miembros permitidos en tu plan." });
        }

        next();
    } catch (error) {
        console.error("❌ Error en validación de unión a equipo:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

module.exports = {
    validarCreacionClub,
    validarCreacionEquipo,
    validarCreacionEstadistica,
    validarUnionEquipo
};
