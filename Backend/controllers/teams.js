const UsuariosEquipos = require('../models/UsuariosEquipos');
const Equipo = require('../models/Equipo');
const Usuario = require('../models/Usuario');
const Club = require("../models/Club");
const UsuarioClub = require('../models/UsuarioClub'); // Importar el modelo
const Transaccion = require('../models/Transaccion');





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


const comprarMembresia = async (req, res) => {
    const { usuario_id, tipo_suscripcion, transaccion_id, duracion_meses } = req.body;

    if (!usuario_id || !tipo_suscripcion || !transaccion_id || !duracion_meses) {
        return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }
    console.log(transaccion_id)

    try {
        const usuario = await Usuario.findByPk(usuario_id);

        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
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

        res.status(200).json({ msg: "Membresía actualizada correctamente", usuario });

    } catch (error) {
        console.error("❌ Error al actualizar la membresía:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};




const comprarMatricula = async (req, res) => {
    const { usuario_id, club_id, transaccion_id, duracion_meses } = req.body;

    if (!usuario_id || !club_id || !transaccion_id || !duracion_meses) {
        return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }

    try {
        // 📌 Buscar si el usuario YA está registrado en el club
        let usuarioClub = await UsuarioClub.findOne({ where: { usuario_id, club_id } });

        // 📌 Si NO está registrado, cancelar el proceso
        if (!usuarioClub) {
            return res.status(400).json({ msg: "El usuario no está registrado en el club. Debe unirse primero." });
        }

        // 📌 Si está registrado, pero aún no ha pagado (activado: false), actualizar la activación y extender la matrícula
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

        res.status(200).json({ msg: "Matrícula activada correctamente", usuarioClub });

    } catch (error) {
        console.error("❌ Error al actualizar la matrícula:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
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
        await comprarMembresia(fakeReq, res);

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

        const { usuario_id, club_id, total, metodo_pago, duracion_meses, destinatario_id } = req.body;

        if (!usuario_id || !club_id || !total || !metodo_pago || !duracion_meses || !destinatario_id) {
            return res.status(400).json({ msg: "Faltan datos obligatorios en la solicitud" });
        }

        // 📌 Crear la transacción con `destinatario_id`
        const transaccion = await Transaccion.create({
            usuario_id, 
            destinatario_id,  // ✅ Guardamos quién recibe el dinero
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
            usuario_id,
            club_id,
            transaccion_id: transaccion.id,
            duracion_meses
        }};

        // 📌 Llamar a `comprarMatricula()` y ESPERAR SU RESPUESTA
        await comprarMatricula(fakeReq, res);

    } catch (error) {
        console.error("❌ Error al pagar la matrícula:", error);
        if (!res.headersSent) { // ✅ Verificar si ya se envió una respuesta
            res.status(500).json({ msg: "Error interno del servidor" });
        }
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
    pagarMembresia
  };
