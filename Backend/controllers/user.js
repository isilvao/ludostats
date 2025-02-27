const bcrypt = require("bcryptjs");
const image = require("../utils/image");
const User = require("../models/Usuario");
const UsuarioClub = require("../models/UsuarioClub");
const Equipo = require("../models/Equipo");
const Club = require("../models/Club");
const UsuariosEquipos = require("../models/UsuariosEquipos");
const { Op } = require("sequelize");
const cloudinary = require('../utils/cloudinary');  // 📌 Importa Cloudinary correctamente
const { Resend } = require('resend');

//*********************     PERSONAL ROUTES     *********************
async function getMe(req, res) {
  const { user_id } = req.user;

  const response = await User.findOne({
    where: { id: user_id },
    include: { model: User, as: "acudiente" },
  });

  if (!response) {
    res.status(404).send({ msg: "No se ha encontrado el usuario" });
  } else if (response.rol === "deportista") {
    res.status(200).send(response);
  } else {
    response.acudiente = null;
    res.status(200).send(response);
  }
}

async function updateMe(req, res) {
  const { user_id } = req.user;

  const userData = req.body;

  delete userData.acudiente_id;

  if (userData.contrasena) {
    const salt = bcrypt.genSaltSync(10);
    userData.contrasena = bcrypt.hashSync(userData.contrasena, salt);
  } else {
    delete userData.contrasena;
  }

  // if (req.files.foto) {
  //   userData.foto = image.getFilePath(req.files.foto);
  // }

  User.update(userData, { where: { id: user_id } })
    .then((response) => {
      if (!response[0]) {
        res.status(404).send({ msg: "Error al actualizar el usuario" });
      } else {
        res.status(200).send({ msg: "Usuario actualizado correctamente" });
      }
    })
    .catch((err) => {
      res.status(500).send({ msg: "Error al actualizar el usuario" });
    });
}

async function deleteMe(req, res) {
  const { user_id } = req.user;

  User.destroy({ where: { id: user_id } })
    .then((response) => {
      if (!response) {
        return res.status(404).send({ msg: "No se ha encontrado el usuario" });
      } else {
        return res.status(200).send({ msg: "Usuario eliminado correctamente" });
      }
    })
    .catch((err) => {
      return res.status(500).send({ msg: "Error al eliminar el usuario" });
    });
}

async function updatePassword(req, res) {
  const { id } = req.params;
  const userData = req.body;

  if (userData.contrasena) {
    const salt = bcrypt.genSaltSync(10);
    userData.contrasena = bcrypt.hashSync(userData.contrasena, salt);
  } else {
    delete userData.contrasena;
  }

  User.update(userData, { where: { id } })
    .then((response) => {
      if (!response[0]) {
        res.status(404).send({ msg: "No se ha encontrado el usuario" });
      } else {
        res.status(200).send({ msg: "Usuario actualizado correctamente" });
        console.log("usuario actualizada correctamente");
      }
    })
    .catch((err) => {
      res.status(500).send({ msg: "Error al actualizar el usuario" });
    });
}

async function updatePasswordFromProfile(req, res) {
  const { id } = req.params;
  const { contrasena, nuevaContrasena } = req.body;

  try {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).send({ msg: "No se ha encontrado el usuario" });
    }

    const isMatch = bcrypt.compareSync(contrasena, user.contrasena);

    if (!isMatch) {
      return res.status(400).send({ msg: "La contraseña actual es incorrecta" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedNewPassword = bcrypt.hashSync(nuevaContrasena, salt);

    user.contrasena = hashedNewPassword;

    await user.save();

    res.status(200).send({ msg: "Contraseña actualizada correctamente" });
    console.log("Contraseña actualizada correctamente");
  } catch (err) {
    res.status(500).send({ msg: "Error al actualizar la contraseña" });
  }
}

//*********************     GENERAL ROUTES     *********************
async function getUsers(req, res) {

  try {
    const response = await User.findAll();

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ msg: "Error al obtener los usuarios" });
  }
}

async function createUser(req, res) {
  const { contrasena } = req.body;

  const salt = bcrypt.genSaltSync(10);

  const hashedPassword = bcrypt.hashSync(contrasena, salt);

  let imagePath = null;

  if (req.files.foto) {
    imagePath = image.getFilePath(req.files.foto);
  }

  User.create({
    ...req.body,
    contrasena: hashedPassword,
    foto: imagePath,
  })
    .then((userStored) => {
      if (!userStored) {
        res.status(400).send({ msg: "Error al crear el usuario" });
      }
      res
        .status(200)
        .send({
          msg: "Usuario creado correctamente",
          user: userStored,
          success: true,
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ msg: "Error al crear el usuario" });
    });
}

async function updateUser(req, res) {
  const { id } = req.params;
  const userData = req.body;

  delete userData.id;

  if (userData.documento === "") {
    delete userData.documento;
  }

  if (userData.fecha_nacimiento === "") {
    delete userData.fecha_nacimiento;
  }

  if (userData.contrasena) {
    const salt = bcrypt.genSaltSync(10);
    userData.contrasena = bcrypt.hashSync(userData.contrasena, salt);
  } else {
    delete userData.contrasena;
  }

  // if (req.files.foto) {
  //   userData.foto = image.getFilePath(req.files.foto);
  // }


  User.update(userData, { where: { id } })
    .then((response) => {
      if (!response[0]) {
        res.status(404).send({ msg: "No se ha encontrado el usuario" });
      } else {
        res.status(200).send({ msg: "Usuario actualizado correctamente" });
        console.log("usuario actualizado correctamente");
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send({ msg: "Error al actualizar el usuario" });
    });
}


async function deleteUser(req, res) {
  const { id } = req.params;

  User.destroy({ where: { id } })
    .then((response) => {
      if (!response) {
        res.status(404).send({ msg: "No se ha encontrado el usuario" });
      } else {
        res
          .status(200)
          .send({ msg: "Usuario eliminado correctamente", success: true });
      }
    })
    .catch((err) => {
      res.status(500).send({ msg: "Error al eliminar el usuario" });
    });
}

async function getUserByEmail(req, res) {
  const { correo } = req.query; // Obtenemos "correo" desde los parámetros de consulta

  if (!correo) {
    return res.status(400).send({ msg: "El correo electrónico es requerido" });
  }

  try {
    const user = await User.findOne({ where: { correo } }); // Busca el usuario por correo

    if (!user) {
      console.log("el usuario no existe");
      return res.status(404).send({ msg: "Usuario no encontrado" });
    }

    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error en el servidor" });
  }
}

//*********************     ACUDIENTE ROUTES     *********************

async function getMyChildren(req, res) {
  const { user_id } = req.user;

  try {
    const deportistas = await User.findAll({
      where: { acudiente_id: user_id },
    });

    if (!deportistas) {
      res.status(404).send({ msg: "No se han encontrado deportistas" });
    } else {
      res.status(200).send(deportistas);
    }
  } catch (error) {
    res.status(500).send({ msg: "Error al obtener a los deportistas" });
  }
}

async function getOneChild(req, res) {
  const { id_child } = req.params;
  const { user_id } = req.user;

  try {
    const acudiente = await User.findOne({
      where: { id: user_id },
      include: { model: User, as: "dependientes" },
    });

    if (!acudiente) {
      return res.status(404).send({ msg: "No se ha encontrado el acudiente" });
    }
    console.log(id_child);
    console.log(
      "dependientes IDs:",
      acudiente.dependientes.map((dep) => dep.id)
    );

    const dependiente = acudiente.dependientes.find(
      (dependientes) => dependientes.id.toString() === id_child
    );

    if (!dependiente) {
      return res
        .status(404)
        .send({
          msg: "No se ha encontrado el dependiente con el ID especificado",
        });
    }

    return res.status(200).send(dependiente);
  } catch (error) {
    console.error(error); // Log del error
    return res.status(500).send({ msg: "Error al obtener al deportista" });
  }
}

//*********************     EQUIPOS ROUTES     *********************
const buscarEquiposUsuario = async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const registros = await UsuariosEquipos.findAll({ where: { usuario_id } });

    if (!registros.length) {
      return res
        .status(404)
        .json({ msg: "El usuario no pertenece a ningún equipo" });
    }

    const idsEquipos = registros.map((registro) => registro.equipo_id);

    const equipos = await Equipo.findAll({ where: { id: idsEquipos } });

    res.status(200).json(equipos);
  } catch (error) {
    console.error("Error al buscar equipos del usuario:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

//*********************     CLUB ROUTES     *********************
async function userJoinsClub(req, res) {
  const { id_club } = req.params;
  const { user_id } = req.user;

  const response = await UsuarioClub.findOne({
    where: { club_id: id_club, usuario_id: user_id },
  });

  if (response) {
    res.status(400).send({ msg: "Ya te encuentras unido a este club" });
  } else {
    UsuarioClub.create({ club_id: id_club, usuario_id: user_id, rol: "miembro" })
      .then((response) => {
        res
          .status(200)
          .send({ msg: "Usuario unido al club correctamente", success: true });
      })
      .catch((err) => {
        res.status(500).send({ msg: "Error al unir el usuario al club" });
      });
  }
}

const buscarClubesUsuario = async (req, res) => {
  const { usuario_id } = req.params;

  // Cambie para usar el id del usuario que viene en el token
  const { user_id } = req.user;

  try {
    // 📌 Obtener los equipos del usuario, excluyendo los donde su rol sea `2` (padre)
    const registros = await UsuariosEquipos.findAll({
      where: {
        user_id,
        rol: { [Op.ne]: 2 }, // 📌 Excluir equipos donde el usuario sea solo "padre"
      },
    });

    if (!registros.length) {
      return res
        .status(404)
        .json({ msg: "El usuario no pertenece a ningún equipo válido" });
    }

    // 📌 Extraer las `id` de los equipos
    const idsEquipos = registros.map((registro) => registro.equipo_id);

    // 📌 Buscar los clubes de esos equipos
    const equipos = await Equipo.findAll({ where: { id: idsEquipos } });

    // 📌 Extraer los IDs de los clubes desde los equipos (sin duplicados)
    const idsClubesDeEquipos = [...new Set(equipos.map((equipo) => equipo.club_id))];

    // 📌 Buscar los clubes en los que el usuario es gerente
    const clubesComoGerente = await Club.findAll({ where: { gerente_id: usuario_id } });

    // 📌 Unir ambos conjuntos de clubes y eliminar duplicados
    const idsClubesUnicos = [...new Set([...idsClubesDeEquipos, ...clubesComoGerente.map(c => c.id)])];

    const clubesFinales = await Club.findAll({ where: { id: idsClubesUnicos } });

    res.status(200).json(clubesFinales);
  } catch (error) {
    console.error("Error al buscar clubes del usuario:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};


const userLeavesClub = async (req, res) => {
  /**
   * Funcion para cuando un usuario decide salirse de un club
   */

  const { user_id } = req.user;
  const { id_club } = req.params;

  try {
    UsuarioClub.destroy({ where: { usuario_id: user_id, club_id: id_club } })
      .then((response) => {
        if (!response) {
          return res
            .status(400)
            .send({ msg: "No se ha encontrado el usuario en este club" });
        } else {
          return res
            .status(200)
            .send({ msg: "Ha dejado el club de forma correcta." });
        }
      })
      .catch((error) => {
        return res.status(500).send({ msg: "Error en el servidor", error });
      });
  } catch (error) {
    return res.status(500).send({ msg: "Error del servidor" });
  }
};

const eliminarUsuarioClub = async (req, res) => {
  /**
   * Funcion para eliminar un usuario de un club
   */
  const { id_club, id_user } = req.params;

  try {
    UsuarioClub.destroy({ where: { usuario_id: id_user, club_id: id_club } })
      .then((response) => {
        if (!response) {
          return res
            .status(400)
            .send({ msg: "No se ha encontrado el usuario en este club" });
        } else {
          return res
            .status(200)
            .send({ msg: "Usuario eliminado del club de forma correcta." });
        }
      })
      .catch((error) => {
        return res.status(500).send({ msg: "Error en el servidor", error });
      });
  } catch (error) {
    return res.status(200).send({ msg: "Error en el servidor" });
  }
};

const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, correo } = req.body;
  let foto = req.file ? req.file.path : null; // 📌 Obtiene la URL de Cloudinary

  try {
    const usuario = await User.findByPk(id);
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" });

    await usuario.update({ nombre, apellido, correo, foto });

    res.status(200).json({ msg: "Usuario actualizado", usuario });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

const actualizarFotoUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    // 📌 Verificar si el usuario existe
    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // 📌 Verificar si se ha subido un archivo
    if (!req.file) {
      return res.status(400).json({ msg: "No se ha proporcionado ninguna imagen" });
    }

    // 📌 Subir la imagen a Cloudinary
    const resultado = await cloudinary.uploader.upload(req.file.path, {
      folder: "usuarios", // Carpeta en Cloudinary
      public_id: `usuario_${id}`,
      overwrite: true
    });

    // 📌 Guardar la URL en la base de datos
    usuario.foto = resultado.secure_url;
    await usuario.save();

    // 📌 Devolver la URL de la imagen
    res.status(200).json({
      msg: "Foto actualizada correctamente",
      foto: resultado.secure_url
    });

  } catch (error) {
    console.error("❌ Error al actualizar la foto del usuario:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};


/////////////////////////
///send email

const sendEmail = async (req, res) => {
  const resend = new Resend("re_AyQTq895_HDdFFDVdEJtDPTBH5qRCpfZ8");

  try {
      const body = req.body;

      if (body.firstName && body.otp && body.email) {
          const { firstName, otp, email } = body;
          const logoUrl = "https://res.cloudinary.com/dnoptrz2d/image/upload/otros/logo_ludostats2.png";

          const { data, error } = await resend.emails.send({
              from: "general@ludostats.com",
              to: [email],
              subject: "Solicitud de Cambio de Contraseña",
              html: `
              <html>
              <head>
                  <meta charset="UTF-8">
                  <style>
                      body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4; }
                        .email-container { max-width: 600px; margin: 20px auto; background: #fdfdfd; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
                        .header { background-color: #9fedc0; padding: 20px; text-align: center; }
                        .header img { width: 200px; }
                        .content { padding: 30px; text-align: center; }
                        .content h1 { font-size: 24px; color: #333; }
                        .content p { font-size: 16px; color: #555; margin-bottom: 20px; }
                        .otp-box { background-color: #f56758; color: #fff; padding: 15px; font-size: 22px; font-weight: bold; display: inline-block; border-radius: 5px; }
                        .footer { margin-top: 20px; padding: 20px; background: #f8f8f8; text-align: center; font-size: 12px; color: #777; }
                  </style>
              </head>
              <body>
                  <div class="email-container">
                      <div class="header">
                          <img src="${logoUrl}" alt="LudoStats Logo">
                      </div>
                      <div class="content">
                          <h1>Hola, ${firstName}!</h1>
                          <p>Has solicitado cambiar tu contraseña en <strong>LudoStats</strong>.</p>
                          <p>Utiliza el siguiente código de verificación:</p>
                          <div class="otp-box">${otp}</div>
                          <p>Este código es válido por un tiempo limitado.</p>
                      </div>
                      <div class="footer">
                          Si no solicitaste este cambio, por favor ignora este correo.
                      </div>
                  </div>
              </body>
              </html>
              `,
          });

          if (error) {
              return res.status(500).json({ error });
          }

          return res.json(data);
      }

      return res.status(400).json({ error: "Solicitud inválida" });
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
};


const sendVerificationEmail1 = async (req, res) => {
  const resend = new Resend("re_AyQTq895_HDdFFDVdEJtDPTBH5qRCpfZ8");

  try {
      const { firstName, otp, email, id } = req.body;
      const logoUrl = "https://res.cloudinary.com/dnoptrz2d/image/upload/otros/logo_ludostats2.png";

      const verificationLink = `http://localhost:3000/home?otp=${otp}&id=${id}`
;

      const { data, error } = await resend.emails.send({
          from: "general@ludostats.com",
          to: [email],
          subject: "Verifica tu cuenta en LudoStats",
          html: `
          <html>
          <head>
              <meta charset="UTF-8">
              <style>
                  .email-container { max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
                  .header { background-color: #9fedc0; padding: 20px; text-align: center; }
                  .header img { width: 200px; }
                  .content { padding: 30px; text-align: center; }
                  .content h1 { font-size: 24px; color: #333; }
                  .content p { font-size: 16px; color: #555; margin-bottom: 20px; }
                  .verify-button { display: inline-block; background-color: #2ecc71; color: #fff; padding: 15px 25px; border-radius: 5px; text-decoration: none; font-size: 18px; }
              </style>
          </head>
          <body>
              <div class="email-container">
                  <div class="header">
                      <img src="${logoUrl}" alt="LudoStats Logo">
                  </div>
                  <div class="content">
                      <h1>¡Bienvenido, ${firstName}!</h1>
                      <p>Gracias por registrarte en <strong>LudoStats</strong>. Por favor, verifica tu cuenta haciendo clic en el botón de abajo.</p>
                      <a href="${verificationLink}" class="verify-button">Verificar Cuenta</a>
                      <p>O puedes ingresar este código manualmente:</p>
                      <div class="otp-box" onclick="copyToClipboard('${otp}')">${otp}</div>
                  </div>
              </div>
          </body>
          </html>
          `,
      });

      if (error) return res.status(500).json({ error });

      return res.json(data);
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
};

const activateUser = async (req, res) => {
  const { user_id } = req.body;

  try {
    const usuario = await User.findByPk(user_id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    usuario.correo_validado = true;
    await usuario.save(); // ✅ Asegurar que la actualización se complete antes de continuar

    return res.status(200).json({ msg: "Usuario activado correctamente" }); // ✅ Respuesta después de actualizar

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



const isAccountValid = async(req,res) =>{

  try{
    const { id } = req.params
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ error: "El usuario no existe" }); // ✅ Manejar usuario no encontrado
  }

  return res.status(200).json({ correo_validado: user.correo_validado }); // ✅ Devolver el estado correctamente


  }catch(error){
    return res.status(500).json({error: error.massage})
  }
  
}



module.exports = {
  getMe,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  userJoinsClub,
  getOneChild,
  getMyChildren,
  getUserByEmail,
  updatePassword,
  buscarEquiposUsuario,
  buscarClubesUsuario,
  eliminarUsuarioClub,
  userLeavesClub,
  actualizarUsuario,
  deleteMe,
  actualizarFotoUsuario,
  updatePasswordFromProfile,
  sendEmail,
  sendVerificationEmail1,
  activateUser,
  isAccountValid
};
