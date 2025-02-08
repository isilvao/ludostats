const image = require("../utils/image");
const Club = require("../models/Club");
const UsuarioClub = require("../models/UsuarioClub");
const Equipo = require("../models/Equipo");

const buscarMisClubes = async (req, res) => {
  const { user_id } = req.user;

  try {
    const clubes = await UsuarioClub.findAll({
      where: { usuario_id: user_id },
      include: [{ model: Club, as: "club" }],
    });
    const clubesResponse = clubes.map((club) => club.club);

    res.status(200).json(clubesResponse);
  } catch (error) {
    console.error("Error al buscar los clubes del usuario:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

async function createClub(req, res) {
  const { user_id } = req.user;
  const {nombre, deporte} = req.body;

  let imagePath = null;

  //TODO: No funciona la subida de logo del club
  // if (req.files.logo) {
  //   imagePath = image.getFilePath(req.files.logo);
  // }

  Club.create({
    nombre,
    deporte,
    gerente_id: user_id,
    logo: imagePath,
  })
    .then((clubStored) => {
      if (!clubStored) {
        return res.status(400).send({ msg: "Error al crear el club" });
      } else {
        return res.status(200).send({
          msg: "Club creado correctamente",
          club: clubStored,
          success: true,
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({ msg: "Error al crear el club" });
    });
}

async function updateClub(req, res) {
  const { id_club } = req.params;

  const club = req.club;

  const userData = req.body;

  if (req.files.logo) {
    imagePath = image.getFilePath(userData.logo);
  } else {
    imagePath = null;
  }

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

  const club = req.club;

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

module.exports = {
  createClub,
  updateClub,
  deleteClub,
  encontrarClubPorId,
  encontrarClubPorEquipoId,
  buscarMisClubes,
  actualizarClub,
};
