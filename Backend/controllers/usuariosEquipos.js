const UsuariosEquipos = require('../models/UsuariosEquipos');
const Equipo = require('../models/Equipo');

const Usuario = require('../models/Usuario');
const bcrypt = require("bcryptjs");

const borrarUsuarioEquipo = async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await UsuariosEquipos.destroy({ where: { id } });

        if (!resultado) {
            return res.status(404).json({ msg: 'Registro no encontrado' });
        }

        res.status(200).json({ msg: 'Registro eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};



const modificarUsuarioEquipo = async (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;

    try {
        const registro = await UsuariosEquipos.findByPk(id);

        if (!registro) {
            return res.status(404).json({ msg: 'Registro no encontrado' });
        }

        await registro.update(datosActualizados);

        res.status(200).json({ msg: 'Registro actualizado correctamente', registro });
    } catch (error) {
        console.error('Error al modificar el registro:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};


// 📌 Contraseña fija para todos los hijos
const PASSWORD_HIJOS = "Hijo123*";

// 📌 Función para generar un correo aleatorio
const generarCorreoAleatorio = (nombre, apellido) => {
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${nombre.toLowerCase()}.${apellido.toLowerCase()}${randomString}@hijos.com`;
};

// 📌 Función para registrar un nuevo usuario hijo
const registrarHijo = async (nombre, apellido, acudiente_id) => {
    const correoGenerado = generarCorreoAleatorio(nombre, apellido);
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(PASSWORD_HIJOS, salt);

    const nuevoHijo = await Usuario.create({
        nombre,
        apellido,
        correo: correoGenerado,
        contrasena: hashPassword,
        activo: true,
        rol: "otro",  // En `Usuarios` se registra como "otro"
        acudiente_id
    });

    console.log(`📌 Hijo registrado en Usuarios: ${nuevoHijo.id} - Correo: ${correoGenerado}`);
    return nuevoHijo.id;
};

// 📌 Asigna el entrenador al equipo
const asignarEntrenadorAEquipo = async (equipoId, usuario_id) => {
    const equipo = await Equipo.findByPk(equipoId);
    if (!equipo) {
        throw new Error('Equipo no encontrado');
    }
    await equipo.update({ entrenador_id: usuario_id });
    await equipo.reload();
    console.log(`📌 Entrenador asignado correctamente: ${usuario_id}`);
};

// 📌 Maneja la asignación del acudiente y del hijo
const asignarAcudienteYHijo = async (acudiente_id, equipo_id, nombreHijo, apellidoHijo) => {
    // 📌 Registrar al hijo en la base de datos con correo y contraseña
    const extra_id = await registrarHijo(nombreHijo, apellidoHijo, acudiente_id);

    // 📌 Verificar si el usuario hijo ya está en el equipo
    const registroHijo = await UsuariosEquipos.findOne({
        where: { usuario_id: extra_id, equipo_id },
    });

    if (registroHijo) {
        throw new Error('El usuario hijo ya está registrado en este equipo.');
    }

    // 📌 Registrar el hijo en UsuariosEquipos con rol de Hijo (5)
    console.log(`📌 Asignando automáticamente el usuario hijo ${extra_id} al equipo ${equipo_id} como hijo.`);
    await UsuariosEquipos.create({
        usuario_id: extra_id,
        equipo_id,
        rol: 5,  // 5 = Hijo en equipo
    });

    return extra_id;
};

const crearUsuarioEquipo = async (req, res) => {
    const { usuario_id, equipo_id, rol, nombre, apellido } = req.body;

    if (!usuario_id || !equipo_id || rol === undefined || rol === null) {
        return res.status(400).json({ msg: 'Faltan datos obligatorios' });
    }

    try {
        // 📌 Verificar si el usuario ya está registrado en el equipo
        const usuarioExistente = await UsuariosEquipos.findOne({
            where: { usuario_id, equipo_id },
        });

        if (usuarioExistente) {
            return res.status(409).json({ msg: 'El usuario ya está registrado en este equipo.' });
        }

        // 📌 Crear el registro en UsuariosEquipos
        const nuevoRegistro = await UsuariosEquipos.create({
            usuario_id,
            equipo_id,
            rol,
        });

        console.log(`📌 Usuario ${usuario_id} asignado al equipo ${equipo_id} con rol ${rol}`);

        // 📌 Si el usuario es profesor (3), asignarlo automáticamente como entrenador
        if (rol === 3) {
            await asignarEntrenadorAEquipo(equipo_id, usuario_id);
        }

        // 📌 Si el usuario es acudiente (2) y se recibe nombre/apellido, se crea el hijo
        if (rol === 2 && nombre && apellido) {
            try {
                const extra_id = await asignarAcudienteYHijo(usuario_id, equipo_id, nombre, apellido);
                console.log(`📌 Registro del hijo completado con ID ${extra_id}`);
            } catch (error) {
                console.error('❌ Error al asignar acudiente e hijo:', error.message);
                return res.status(400).json({ msg: error.message });
            }
        }

        res.status(201).json({ msg: 'Registro creado correctamente', registro: nuevoRegistro });

    } catch (error) {
        console.error('❌ Error al crear el registro:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};








module.exports = {
    crearUsuarioEquipo,
    modificarUsuarioEquipo,
    borrarUsuarioEquipo,
    asignarEntrenadorAEquipo

}