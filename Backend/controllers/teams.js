const UsuariosEquipos = require('../models/UsuariosEquipos');
const Equipo = require('../models/Equipo');
const Usuario = require('../models/Usuario');
const Club = require("../models/Club");
const UsuarioClub = require('../models/UsuarioClub'); // Importar el modelo
const Transaccion = require('../models/Transaccion');
const Notificacion = require('../models/Notificacion')





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

//////////////////////////////////////
///////////////////////////////////
//CONTROLADOR DE TRANSACCIONES


const crearTransaccion = async (req, res) => {
    const { usuario_id, destinatario_id, total, tipo, concepto, club_id, metodo_pago } = req.body;

    if (!usuario_id || !total || !tipo || !metodo_pago) {
        return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }

    try {
        // 📌 Crear la transacción
        const nuevaTransaccion = await Transaccion.create({
            usuario_id,
            destinatario_id: destinatario_id || null,
            total,
            tipo,
            concepto: concepto || null,
            club_id: club_id || null,
            fecha: new Date(),
            metodo_pago
        });

        res.status(201).json({ msg: "Transacción creada correctamente", transaccion: nuevaTransaccion });
    } catch (error) {
        console.error("❌ Error al crear la transacción:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};


const obtenerTransaccionesPorUsuario = async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const transacciones = await Transaccion.findAll({
            where: { usuario_id },
            include: [
                {
                    model: Usuario,
                    as: "destinatario",
                    attributes: ['id', 'nombre', 'apellido', 'correo'] // 📌 Solo los campos relevantes del destinatario
                },
                {
                    model: Club,
                    attributes: ['id', 'nombre']
                }
            ],
            order: [['fecha', 'DESC']] // 📌 Ordenar de más reciente a más antiguo
        });

        res.status(200).json(transacciones);
    } catch (error) {
        console.error("❌ Error al obtener las transacciones:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};


//////////////////////////////////////
///////////////////////////////////
//CONTROLADOR DE MEMBRESIA y MATRICULA


const comprarMembresia = async (req) => {
    const { usuario_id, tipo_suscripcion, transaccion_id, duracion_meses } = req.body;

    if (!usuario_id || !tipo_suscripcion || !transaccion_id || !duracion_meses) {
        throw new Error("Faltan datos obligatorios");
    }

    console.log(transaccion_id);

    try {
        const usuario = await Usuario.findByPk(usuario_id);

        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }

        // 📌 Si ya tiene una membresía activa, extender la fecha
        let nuevaFechaFin;
        if (usuario.fecha_fin_suscripcion && usuario.fecha_fin_suscripcion > new Date()) {
            nuevaFechaFin = new Date(usuario.fecha_fin_suscripcion);
        } else {
            nuevaFechaFin = new Date();
        }

        nuevaFechaFin.setMonth(nuevaFechaFin.getMonth() + duracion_meses);

        // 📌 Actualizar usuario con nueva membresía
        usuario.tipo_suscripcion = tipo_suscripcion;
        usuario.fecha_fin_suscripcion = nuevaFechaFin;
        usuario.ultima_transaccion_id = transaccion_id;

        await usuario.save();

        return { msg: "Membresía actualizada correctamente", usuario };

    } catch (error) {
        console.error("❌ Error al actualizar la membresía:", error);
        throw error;
    }
};




const comprarMatricula = async (req) => {
    const { usuario_id, club_id, transaccion_id, duracion_meses } = req.body;

    if (!usuario_id || !club_id || !transaccion_id || !duracion_meses) {
        throw new Error("Faltan datos obligatorios");
    }

    try {
        // 📌 Buscar si el usuario YA está registrado en el club
        let usuarioClub = await UsuarioClub.findOne({ where: { usuario_id, club_id } });

        // 📌 Si NO está registrado, cancelar el proceso
        if (!usuarioClub) {
            throw new Error("El usuario no está registrado en el club. Debe unirse primero.");
        }

        // 📌 Si está registrado, actualizar activación y extender la matrícula
        let nuevaFechaFin;
        if (usuarioClub.fecha_fin_matricula && usuarioClub.fecha_fin_matricula > new Date()) {
            nuevaFechaFin = new Date(usuarioClub.fecha_fin_matricula);
        } else {
            nuevaFechaFin = new Date();
        }

        nuevaFechaFin.setMonth(nuevaFechaFin.getMonth() + duracion_meses);

        usuarioClub.activado = true;
        usuarioClub.fecha_fin_matricula = nuevaFechaFin;
        usuarioClub.transaccion_id = transaccion_id;

        await usuarioClub.save();

        return { usuarioClub };

    } catch (error) {
        throw error;
    }
};



//////////////////////////////////////
///////////////////////////////////
//CONTROLADOR DE MEMBRESIA y MATRICULA






const pagarMembresia = async (req, res) => {
    try {
        console.log("📌 Body recibido en pagarMembresia:", req.body);

        const usuario_ids = req.body.usuario_id;
        const tipo_suscripcion = req.body.tipo_suscripcion;
        const total = req.body.total;
        const metodo_pago = req.body.metodo_pago;
        const duracion_meses = req.body.duracion_meses;
        const destinatario_id = req.body.destinatario_id;

        // 📌 Crear la transacción con `destinatario_id`
        const transaccion = await Transaccion.create({
            usuario_id: usuario_ids, 
            destinatario_id,  // ✅ Guardamos quién recibe el dinero
            total,
            tipo: "suscripcion",
            metodo_pago,
        });

        console.log("✅ Transacción creada:", transaccion.id);

        // 📌 Simular un objeto `req` falso con `body`
        const fakeReq = { body: {
            usuario_id: usuario_ids,
            tipo_suscripcion,
            transaccion_id: transaccion.id,
            duracion_meses
        }};

        // 📌 Llamar a `comprarMembresia()` y ESPERAR SU RESPUESTA
        await comprarMembresia(fakeReq);

        // 📌 Crear notificación para el usuario que pagó
        await Notificacion.create({
            usuario_id: usuario_ids,
            mensaje: `Tu membresía ${tipo_suscripcion} se renovó/adquirió con éxito.`,
            tipo: "membresia",
            leido: false
        });

        res.status(200).json({ msg: "Pago de membresia exitoso"});

    } catch (error) {
        console.error("❌ Error al pagar la membresía:", error);
        if (!res.headersSent) { // ✅ Verificar si ya se envió una respuesta
            res.status(500).json({ msg: "Error interno del servidor" });
        }
    }
};


const pagarMatricula = async (req, res) => {
    try {
        console.log("📌 Body recibido en pagarMatricula:", req.body);

        let { usuario_id, club_id, total, metodo_pago, duracion_meses, destinatario_id } = req.body;

        if (!usuario_id || !club_id || !total || !metodo_pago || !duracion_meses) {
            return res.status(400).json({ msg: "Faltan datos obligatorios en la solicitud" });
        }

        // 📌 Verificar si el usuario tiene un acudiente
        const usuario = await Usuario.findByPk(usuario_id);
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        let usuarioPago = usuario;  // Si no tiene acudiente, él es quien paga
        if (usuario.acudiente_id) {
            usuarioPago = await Usuario.findByPk(usuario.acudiente_id);
            if (!usuarioPago) {
                return res.status(404).json({ msg: "Acudiente no encontrado" });
            }
            usuario_id = usuarioPago.id;  // Asignar la transacción al acudiente
        }

        // 📌 Si destinatario_id es null, buscar al gerente del club
        if (!destinatario_id) {
            const gerente = await UsuarioClub.findOne({
                where: { club_id, rol: "gerente" }
            });
            if (!gerente) {
                return res.status(404).json({ msg: "No se encontró un gerente para este club" });
            }
            destinatario_id = gerente.usuario_id;
        }

        // 📌 Verificar si la matrícula es nueva o renovación
        const usuarioClubExistente = await UsuarioClub.findOne({ where: { usuario_id: usuario.id, club_id } });
        const nuevaMatricula = !usuarioClubExistente || !usuarioClubExistente.fecha_fin_matricula;

        // 📌 Crear la transacción con `destinatario_id`
        const transaccion = await Transaccion.create({
            usuario_id,
            destinatario_id,
            total,
            tipo: "matricula",
            concepto: `Matrícula en club`,
            metodo_pago,
            fecha: new Date(),
            club_id
        });

        console.log("✅ Transacción creada:", transaccion.id);

        // 📌 Simular un objeto `req` falso con `body`
        const fakeReq = { body: {
            usuario_id: usuario.id, // 🔹 Se usa la ID original para matricular al hijo
            club_id,
            transaccion_id: transaccion.id,
            duracion_meses
        }};

        // 📌 Llamar a `comprarMatricula()` y ESPERAR SU RESPUESTA
        const matricula = await comprarMatricula(fakeReq);

        // 📌 Buscar información del club
        const club = await Club.findByPk(club_id);
        if (!club) {
            return res.status(404).json({ msg: "Club no encontrado" });
        }

        // 📌 Determinar el mensaje de notificación según si es nueva o renovación
        const mensajeUsuario = nuevaMatricula
            ? `Te has matriculado por primera vez al club ${club.nombre}.`
            : `Tu matrícula en el club ${club.nombre} ha sido renovada por ${duracion_meses} meses.`;

        const fechaNotificacion = new Date().toLocaleDateString("es-ES");

        // 📌 Si el usuario tiene un acudiente, incluir ambos nombres en la notificación
        const nombreUsuario = `${usuario.nombre} ${usuario.apellido}`;
        const nombrePago = `${usuarioPago.nombre} ${usuarioPago.apellido}`;
        const mensajeCompleto = usuario.acudiente_id
            ? `${nombrePago} ha pagado la matrícula de ${nombreUsuario} en el club ${club.nombre}.`
            : mensajeUsuario;

        // 📌 Crear notificación para el usuario que pagó (o su acudiente)
        await Notificacion.create({
            usuario_id: usuarioPago.id,
            mensaje: `${mensajeCompleto} (Fecha: ${fechaNotificacion})`,
            tipo: "matricula",
            leido: false,
            fecha_creacion: new Date()
        });

        // 📌 Crear notificación para el gerente del club
        await Notificacion.create({
            usuario_id: destinatario_id,
            mensaje: usuario.acudiente_id
                ? `${nombrePago} ha pagado una matrícula de ${total} para ${nombreUsuario} en el club ${club.nombre}. (Fecha: ${fechaNotificacion})`
                : `${nombrePago} ha pagado una matrícula de ${total} en el club ${club.nombre}. (Fecha: ${fechaNotificacion})`,
            tipo: "matricula",
            leido: false,
            fecha_creacion: new Date()
        });

        res.status(200).json({ msg: "Pago de matrícula exitoso", matricula });

    } catch (error) {
        console.error("❌ Error al pagar la matrícula:", error);
        if (!res.headersSent) { // ✅ Verificar si ya se envió una respuesta
            res.status(500).json({ msg: "Error interno del servidor" });
        }
    }
};


//////////////////////////////////////////
//NOTIFICACIONES///////////////.///////


const marcarNotificacionLeida = async (req, res) => {
    const { id } = req.params;

    try {
        const notificacion = await Notificacion.findByPk(id);
        if (!notificacion) {
            return res.status(404).json({ msg: "Notificación no encontrada" });
        }

        notificacion.leido = true;
        await notificacion.save();

        res.status(200).json({ msg: "Notificación marcada como leída", notificacion });

    } catch (error) {
        console.error("❌ Error al marcar notificación como leída:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};


const obtenerNotificacionesPorUsuario = async (req, res) => {
    try {
        const { usuario_id } = req.params;

        // 📌 Obtener notificaciones del usuario
        const notificaciones = await Notificacion.findAll({
            where: { usuario_id },
            order: [['fecha_creacion', 'DESC']]
        });

        // 📌 Obtener notificaciones NO leídas
        const notificacionesNoLeidas = notificaciones.filter(noti => !noti.leido);

        // 📌 Verificar si el usuario tiene un acudiente (y agregar sus notificaciones)
        const usuario = await Usuario.findByPk(usuario_id);
        let notificacionesHijo = [];

        if (usuario && usuario.acudiente_id) {
            notificacionesHijo = await Notificacion.findAll({
                where: { usuario_id: usuario.acudiente_id },
                order: [['fecha_creacion', 'DESC']]
            });
        }

        const notificacionesFinal = [...notificaciones, ...notificacionesHijo];

        res.status(200).json({
            notificaciones: notificacionesFinal,
            noLeidas: notificacionesNoLeidas,
            notificacionesNuevas: notificacionesNoLeidas.length > 0
        });

    } catch (error) {
        console.error("❌ Error al obtener notificaciones:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};







module.exports = {
    obtenerInfoClubYRol,
    obtenerInfoEquipoYRol,
    crearTransaccion,
    obtenerTransaccionesPorUsuario,
    comprarMembresia,
    comprarMatricula,
    pagarMatricula,
    pagarMembresia,
    marcarNotificacionLeida,
    obtenerNotificacionesPorUsuario
  };
