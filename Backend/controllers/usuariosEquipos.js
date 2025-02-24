const UsuariosEquipos = require("../models/UsuariosEquipos");
const Equipo = require("../models/Equipo");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { UsuarioClub } = require("../models");

const borrarUsuarioEquipo = async (req, res) => {
  const { usuarioId, equipoId } = req.params;

  try {
    const resultado = await UsuariosEquipos.destroy({
      where: { usuario_id: usuarioId, equipo_id: equipoId },
    });

    if (!resultado) {
      return res.status(404).json({ msg: "Registro no encontrado" });
    }

    res.status(200).json({ msg: "Registro eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el registro:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

const modificarUsuarioEquipo = async (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.body;

  try {
    const registro = await UsuariosEquipos.findByPk(id);

    if (!registro) {
      return res.status(404).json({ msg: "Registro no encontrado" });
    }

    await registro.update(datosActualizados);

    res
      .status(200)
      .json({ msg: "Registro actualizado correctamente", registro });
  } catch (error) {
    console.error("Error al modificar el registro:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
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
    acudiente_id
  });

  console.log(
    `📌 Hijo registrado en Usuarios: ${nuevoHijo.id} - Correo: ${correoGenerado}`
  );
  return nuevoHijo.id;
};

// 📌 Asigna el entrenador al equipo
const asignarEntrenadorAEquipo = async (equipoId, usuario_id) => {
  const equipo = await UsuariosEquipos.findOne({
    where: { equipo_id: equipoId, usuario_id },
  });
  if (!equipo) {
    UsuariosEquipos.create({
      usuario_id,
      equipo_id: equipoId,
      rol: 'entrenador'
    })

    const equipo = await Equipo.findByPk(equipoId);

    await UsuarioClub.create({
      usuario_id,
      club_id: equipo.club_id,
      rol: 'entrenador'
    })
  }

  if (equipo.rol !== 'entrenador') {
    await equipo.update({ rol: 'entrenador' });
  } else {
    throw new Error("El usuario ya es entrenador de este equipo");
  }

  await equipo.reload();
  console.log(`📌 Entrenador asignado correctamente: ${usuario_id}`);
};

// 📌 Función para asignar solo el hijo al equipo (el padre NO se registra en `UsuariosEquipos`)
const asignarHijoAlEquipo = async (
  acudiente_id,
  equipo_id,
  nombreHijo,
  apellidoHijo
) => {
  // 📌 Registrar al hijo en la tabla `Usuarios`
  const extra_id = await registrarHijo(nombreHijo, apellidoHijo, acudiente_id);

  // 📌 Verificar si el hijo ya está en el equipo
  const registroHijo = await UsuariosEquipos.findOne({
    where: { usuario_id: extra_id, equipo_id },
  });

  if (registroHijo) {
    throw new Error("El usuario hijo ya está registrado en este equipo.");
  }

  // 📌 Registrar solo el hijo en `UsuariosEquipos` con rol de Hijo (5)
  console.log(
    `📌 Asignando automáticamente el usuario hijo ${extra_id} al equipo ${equipo_id} como hijo.`
  );
  await UsuariosEquipos.create({
    usuario_id: extra_id,
    equipo_id,
    rol: 'miembro', // 5 = Hijo en equipo
  }).catch((error) => {
    console.error("❌ Error al asignar al hijo:", error);
    throw new Error("Error al asignar al hijo");
  });

  const equipo = await Equipo.findByPk(equipo_id);

  await UsuarioClub.create({
    usuario_id: extra_id,
    club_id: equipo.club_id,
    rol: 'miembro'
  }).catch((error) => {
    console.error("❌ Error al asignar al hijo:", error);
    throw new Error("Error al asignar al hijo");
  })

  return extra_id;
};

// 📌 Controlador principal para registrar usuarios en `UsuariosEquipos`
const crearUsuarioEquipo = async (req, res) => {
  const { usuario_id, equipo_id, rol, nombre, apellido } = req.body;

  if (!usuario_id || !equipo_id || rol === undefined || rol === null) {
    return res.status(400).json({ msg: "Faltan datos obligatorios" });
  }

  let nuevoRol = ''
  if (rol === 1) {
    nuevoRol = 'deportista'
  } else if (rol === 2) {
    nuevoRol = 'acudiente'
  } else if (rol === 3) {
    nuevoRol = 'entrenador'
  } else if (rol === 4) {
    nuevoRol = 'administrador'
  } else if (rol === 5) {
    nuevoRol = 'miembro'
  }

  try {
    // 📌 Verificar si el usuario ya está registrado en el equipo
    if (rol != 2) {
      const usuarioExistente = await UsuariosEquipos.findOne({
        where: { usuario_id, equipo_id },
      });

      if (usuarioExistente) {
        return res
          .status(409)
          .json({ msg: "El usuario ya está registrado en este equipo." });
      }
    }

    // 📌 Si el usuario es acudiente (2) y se recibe nombre/apellido, solo creamos al hijo
    if (rol === 2 && nombre && apellido) {
      try {

        const extra_id = await asignarHijoAlEquipo(
          usuario_id,
          equipo_id,
          nombre,
          apellido
        );
        console.log(`📌 Registro del hijo completado con ID ${extra_id}`);

        // 📌 Enviar respuesta para que Insomnia no se quede esperando
        return res.status(201).json({
          msg: "Hijo registrado correctamente en el equipo",
          hijo_id: extra_id,
        });
      } catch (error) {
        console.error("❌ Error al asignar hijo:", error.message);
        return res.status(400).json({ msg: error.message });
      }
    }

    // 📌 Si no es acudiente, registrar normalmente en `UsuariosEquipos`
    const nuevoRegistro = await UsuariosEquipos.create({
      usuario_id,
      equipo_id,
      rol: nuevoRol,
    });

    const equipo = await Equipo.findByPk(equipo_id);

    const registroEnClub = await UsuarioClub.findOne({
      where: { usuario_id, club_id: equipo.club_id }
    });

    if (!registroEnClub) {
      await UsuarioClub.create({
        usuario_id,
        club_id: equipo.club_id,
        rol: nuevoRol
      })
    } else {
      await registroEnClub.update({ rol: nuevoRol });
    }

    console.log(
      `📌 Usuario ${usuario_id} asignado al equipo ${equipo_id} con rol ${rol}`
    );

    // 📌 Si el usuario es profesor (3), asignarlo automáticamente como entrenador
    if (rol === 3) {
      await asignarEntrenadorAEquipo(equipo_id, usuario_id);
    }

    return res
      .status(201)
      .json({ msg: "Registro creado correctamente", registro: nuevoRegistro });
  } catch (error) {
    console.error("❌ Error al crear el registro:", error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};


const modificarRolUsuarioEquipo = async (req, res) => {
  const { usuario_id, equipo_id } = req.params;
  const { nuevo_rol } = req.body;

  if (!nuevo_rol || typeof nuevo_rol !== "string") {
    return res.status(400).json({ msg: "El nuevo rol es obligatorio y debe ser un string" });
  }

  try {
    const registro = await UsuariosEquipos.findOne({
      where: { usuario_id, equipo_id }
    });

    if (!registro) {
      return res.status(404).json({ msg: "Usuario no encontrado en el equipo" });
    }

    registro.rol = nuevo_rol; // 📌 Guardar el rol como string
    await registro.save();

    res.status(200).json({ msg: "Rol actualizado correctamente", registro });
  } catch (error) {
    console.error("❌ Error al modificar el rol del usuario en el equipo:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

const modificarRolUsuarioClub = async (req, res) => {
  const { usuario_id, club_id } = req.params;
  const { nuevo_rol } = req.body;

  if (!nuevo_rol || typeof nuevo_rol !== "string") {
    return res.status(400).json({ msg: "El nuevo rol es obligatorio y debe ser un string" });
  }

  try {
    const registro = await UsuarioClub.findOne({
      where: { usuario_id, club_id }
    });

    if (!registro) {
      return res.status(404).json({ msg: "Usuario no encontrado en el club" });
    }

    registro.rol = nuevo_rol; // 📌 Guardar el rol como string
    await registro.save();

    res.status(200).json({ msg: "Rol actualizado correctamente", registro });
  } catch (error) {
    console.error("❌ Error al modificar el rol del usuario en el club:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
}


module.exports = {
  crearUsuarioEquipo,
  modificarUsuarioEquipo,
  borrarUsuarioEquipo,
  asignarEntrenadorAEquipo,
  modificarRolUsuarioEquipo,
  modificarRolUsuarioClub
};
