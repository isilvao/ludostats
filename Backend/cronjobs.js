const cron = require('node-cron');
const { Usuario, UsuarioClub, Notificacion, Club } = require('./models');
const { Op } = require('sequelize');

async function ejecutarTareasCron() {
    console.log("⏳ Ejecutando cron job...");

    const hoy = new Date();
    const dosDiasDespues = new Date();
    dosDiasDespues.setDate(hoy.getDate() + 2);

    // 🟢 1️⃣ Verificar membresías próximas a vencer
    const usuarios = await Usuario.findAll({
        where: {
            fecha_fin_suscripcion: {
                [Op.between]: [hoy, dosDiasDespues]
            }
        }
    });

    for (const usuario of usuarios) {
        // 📌 Verificar si YA EXISTE una notificación previa para esta membresía
        const notificacionExistente = await Notificacion.findOne({
            where: {
                usuario_id: usuario.id,
                tipo: "membresia_proxima_expiracion",
                mensaje: { [Op.like]: `%finaliza el ${usuario.fecha_fin_suscripcion.toLocaleDateString("es-ES")}%` }
            }
        });

        if (!notificacionExistente) {
            await Notificacion.create({
                usuario_id: usuario.id,
                mensaje: `Tu membresía finaliza el ${usuario.fecha_fin_suscripcion.toLocaleDateString("es-ES")}. ¡Renueva ahora!`,
                tipo: "membresia_proxima_expiracion",
                leido: false
            });
            console.log(`📢 Notificación de membresía creada para ${usuario.id}`);
        }
    }

    // 🟢 2️⃣ Verificar matrículas próximas a vencer
    const matriculas = await UsuarioClub.findAll({
        where: {
            fecha_fin_matricula: {
                [Op.between]: [hoy, dosDiasDespues]
            }
        }
    });

    for (const matricula of matriculas) {
        const club = await Club.findByPk(matricula.club_id);

        // 📌 Verificar si YA EXISTE una notificación previa para esta matrícula y club
        const notificacionExistente = await Notificacion.findOne({
            where: {
                usuario_id: matricula.usuario_id,
                tipo: "matricula_proxima_expiracion",
                mensaje: { [Op.like]: `%en ${club.nombre} finaliza el ${matricula.fecha_fin_matricula.toLocaleDateString("es-ES")}%` }
            }
        });

        if (!notificacionExistente) {
            await Notificacion.create({
                usuario_id: matricula.usuario_id,
                mensaje: `Tu matrícula en ${club.nombre} finaliza el ${matricula.fecha_fin_matricula.toLocaleDateString("es-ES")}. ¡Renueva!`,
                tipo: "matricula_proxima_expiracion",
                leido: false
            });
            console.log(`📢 Notificación de matrícula creada para ${matricula.usuario_id} en ${club.nombre}`);
        }
    }

    console.log("✅ Cron job finalizado.");
}

// 📌 Ejecutar todos los días a las 08:00 AM
cron.schedule('0 8 * * *', ejecutarTareasCron);

module.exports = { ejecutarTareasCron };
