const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt");
const {Notificacion} = require('../models')

const register = async (req, res) => {
  const { nombre, apellido, correo, contrasena, foto, correo_validado } = req.body;

  if (!correo) return res.status(400).send({ msg: "El correo es obligatorio" });
  if (!contrasena) return res.status(400).send({ msg: "La contraseña es obligatoria" });
  if (!nombre) return res.status(400).send({ msg: "El nombre es obligatorio" });
  if (!apellido) return res.status(400).send({ msg: "El apellido es obligatorio" });

  try {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(contrasena, salt);

    // 📌 Crear usuario
    const userStored = await Usuario.create({
      nombre,
      apellido,
      correo: correo.toLowerCase(),
      contrasena: hashPassword,
      foto: foto || null, // 📌 Guardar la foto si está disponible
      correo_validado
    });

    if (!userStored) {
      return res.status(400).send({ msg: "Error al crear el usuario" });
    }

    // 📌 Crear la notificación de bienvenida
    await Notificacion.create({
      usuario_id: userStored.id,
      tipo: "otro", // 📌 Puedes cambiarlo si agregas un tipo específico de bienvenida
      mensaje: `¡Bienvenido a LudoStats, ${nombre}! Nos alegra tenerte aquí.`,
      leido: false,
      fecha_creacion: new Date()
    });

    console.log(`📌 Notificación de bienvenida creada para ${nombre}`);

    return res.status(200).send({ msg: "Usuario creado correctamente", success: true });

  } catch (err) {
    console.error("❌ Error en el registro:", err);
    return res.status(500).send({ msg: "Error al crear el usuario" });
  }
};


function login(req, res) {
  const { correo, contrasena, rememberMe } = req.body;

  if (!correo) res.status(400).send({ msg: "El correo es obligatorio" });
  if (!contrasena)
    res.status(400).send({ msg: "La contraseña es obligatoria" });

  const emailLowerCase = correo.toLowerCase();

  Usuario.findOne({
    where: {
      correo: emailLowerCase,
    },
  })
    .then((user) => {
      if (!user) {
        res.status(400).send({ msg: "No se ha podido ingresar" });
      } else {
        bcrypt.compare(contrasena, user.contrasena, (err, check) => {
          if (err) {
            res.status(500).send({ msg: "Error del servidor" });
          } else if (!check) {
            res.status(400).send({ msg: "No se pudo ingresar al usuario" });
          } else if (!user.activo) {
            res.status(401).send({ msg: "El usuario no está activo" });
          } else {
            res.status(200).send({
              accessToken: jwt.createAccessToken(user),
              refreshToken: jwt.createRefreshToken(user),
              rememberMe: rememberMe,
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ msg: "Error del servidor" });
    });
}

function refreshAccessToken(req, res) {
  const { token } = req.body;

  if (!token) {
    return res.status(500).send({ msg: "No se ha encontrado el token" });
  }
  const { user_id } = jwt.decodeToken(token);

  Usuario.findOne({ where: { id: user_id } })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ msg: "Usuario no encontrado" });
      } else {
        return res.status(200).send({
          accessToken: jwt.createAccessToken(user),
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({ msg: "Error del servidor" });
    });
}

module.exports = {
  register,
  login,
  refreshAccessToken,
};
