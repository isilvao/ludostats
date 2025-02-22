const image = require("../utils/image");
const Club = require("../models/Club");
const UsuarioClub = require("../models/UsuarioClub");
const Equipo = require("../models/Equipo");
const cloudinary = require('../utils/cloudinary');

const buscarMisClubes = async (req, res) => {
  const { user_id } = req.query;

  try {
    const clubes = await UsuarioClub.findAll({
      where: { usuario_id: user_id },
      include: [{ model: Club, as: "club" }],
    });
    const clubesResponse = clubes.map((club) => {
      return {
        id: club.club.id,
        nombre: club.club.nombre,
        deporte: club.club.deporte,
        logo: club.club.logo,
        rol: club.rol,
      }
    });

    res.status(200).json(clubesResponse);
  } catch (error) {
    console.error("Error al buscar los clubes del usuario:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

const buscarMisClubesGerente = async (req, res) => {
  const { user_id } = req.params;

  try {
    const clubes = await UsuarioClub.findAll({
      where: { usuario_id: user_id, rol: "gerente" },
      include: [{ model: Club, as: "club" }],
    })

    const clubesResponse = clubes.map((club) => club.club);

    res.status(200).json(clubesResponse);

  } catch (error) {
    return res.status(500).send({ msg: "Error al buscar los clubes del gerente" })
  }

}

const actualizarClub = async (req, res) => {
  const { id_club } = req.params;
  let logo = req.file ? req.file.path : null; // 📌 URL de Cloudinary

  try {
    const club = await Club.findByPk(id_club);
    if (!club) return res.status(404).json({ msg: "Club no encontrado" });

    await club.update({ logo });

    res.status(200).json({ msg: "Club actualizado", club });
  } catch (error) {
    console.error("Error al actualizar club:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};


const actualizarClubLogo = async (req, res) => {
  const { id_club } = req.params;

  try {
    const club = await Club.findByPk(id_club);
    if (!club) return res.status(404).json({ msg: "Club no encontrado" });

    // 📌 Verificar si se subió una nueva imagen
    if (!req.file) {
      return res.status(400).json({ msg: "No se ha proporcionado ninguna imagen" });
    }

    // 📌 Subir la imagen a Cloudinary
    const resultado = await cloudinary.uploader.upload(req.file.path, {
      folder: "clubes",
      public_id: `club_${id_club}`,
      overwrite: true
    });

    // 📌 Guardar la URL en la base de datos
    club.logo = resultado.secure_url;
    await club.save();

    res.status(200).json({
      msg: "Logo del club actualizado correctamente",
      logo: resultado.secure_url, // ✅ Devuelve la URL de la imagen
    });

  } catch (error) {
    console.error("❌ Error al actualizar el logo del club:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};


// async function createClub(req, res) {
//   const { user_id } = req.user;
//   const { nombre, deporte } = req.body;

//   let imagePath = null;



//   Club.create({
//     nombre,
//     deporte,
//     logo: imagePath,
//   })
//     .then((clubStored) => {
//       if (!clubStored) {
//         return res.status(400).send({ msg: "Error al crear el club" });
//       } else {

//         UsuarioClub.create({
//           usuario_id: user_id,
//           club_id: clubStored.id,
//           rol: "gerente",
//         }).then((response => {
//           return res.status(200).send({ msg: "Club creado correctamente", club: clubStored, success: true });
//         })).catch((err) => {
//           return res.status(500).send({ msg: "Error al crear el club" });
//         })
//       }
//     })
//     .catch((err) => {
//       return res.status(500).send({ msg: "Error al crear el club" });
//     });
// }



async function createClub(req, res) {
  const { user_id } = req.user;
  const { nombre, deporte } = req.body;

  try {
    let imagePath = null;

    // 📌 Si el usuario subió una imagen, guardarla en Cloudinary
    if (req.file) {
      const resultado = await cloudinary.uploader.upload(req.file.path, {
        folder: "clubes", // 📌 Carpeta en Cloudinary
        public_id: `club_${nombre.replace(/\s+/g, "_")}`, // Nombre basado en el club
        overwrite: true
      });
      imagePath = resultado.secure_url;
    }

    // 📌 Crear el club con la imagen (si se subió)
    const clubStored = await Club.create({
      nombre,
      deporte,
      logo: imagePath,
    });

    if (!clubStored) {
      return res.status(400).json({ msg: "Error al crear el club" });
    }

    // 📌 Asociar al creador como gerente del club
    await UsuarioClub.create({
      usuario_id: user_id,
      club_id: clubStored.id,
      rol: "gerente",
    });

    res.status(200).json({
      msg: "Club creado correctamente",
      club: clubStored,
      success: true,
      logo: imagePath, // ✅ Devuelve la URL de la imagen
    });

  } catch (error) {
    console.error("❌ Error al crear el club:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
}


async function updateClub(req, res) {
  const { id_club } = req.params;

  const club = await Club.findByPk(id_club);

  const userData = req.body;

  club
    .update(userData, { where: { id: id_club } })
    .then((response) => {
      if (!response) {
        res.status(404).send({ msg: "No se ha encontrado el club" });
      } else {
        res
          .status(200)
          .send({ msg: "Club actualizado correctamente", success: true });
      }
    })
    .catch((err) => {
      res.status(500).send({ msg: "Error al actualizar el club" });
    });
}

async function deleteClub(req, res) {
  const { id_club } = req.params;

  const club = await Club.findByPk(id_club);

  club
    .destroy({ where: { id: id_club } })
    .then((response) => {
      if (!response) {
        res.status(404).send({ msg: "No se ha encontrado el club" });
      } else {
        res
          .status(200)
          .send({ msg: "Club eliminado correctamente", success: true });
      }
    })
    .catch((err) => {
      res.status(500).send({ msg: "Error al eliminar el club" });
    });
}

const encontrarClubPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const club = await Club.findByPk(id);

    if (!club) {
      return res.status(404).json({ msg: "Club no encontrado" });
    }

    res.status(200).json(club);
  } catch (error) {
    console.error("Error al buscar el club:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

const encontrarClubPorEquipoId = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar el equipo para obtener el club_id
    const equipo = await Equipo.findByPk(id);
    console.log(id, 1);

    if (!equipo) {
      console.log(id, 2, "problema con el equpo");
      return res.status(404).json({ msg: "Equipo no encontrado" });
    }

    // Buscar el club asociado al club_id del equipo
    const club = await Club.findByPk(equipo.club_id);

    if (!club) {
      return res
        .status(404)
        .json({ msg: "Club no encontrado para el equipo proporcionado" });
    }

    res.status(200).json(club);
  } catch (error) {
    console.error("Error al buscar el club por equipo:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

const getUsersByClub = async (req, res) => {
  const { id_club } = req.params;

  try {
    const usuarios = await UsuarioClub.findAll({
      where: { club_id: id_club },
    });

    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al buscar los usuarios del club:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
}

module.exports = {
  createClub,
  updateClub,
  deleteClub,
  encontrarClubPorId,
  encontrarClubPorEquipoId,
  buscarMisClubes,
  actualizarClub,
  getUsersByClub,
  buscarMisClubesGerente,
  actualizarClubLogo
};
