const Equipo = require("../models/Equipo");
const Usuario = require("../models/Usuario");
const Club = require("../models/Club");
const UsuarioEquipo = require("../models/UsuariosEquipos");

const crearEquipo = async (req, res) => {
  const { nombre, cantidad_deportistas, club_id, entrenador_id } =
    req.body;

  if (!nombre || !cantidad_deportistas || !club_id) {
    return res.status(400).json({ msg: "Faltan datos obligatorios" });
  }

  try {

    let imagePath = null

    if (req.files.logo){
        imagePath = image.getFilePath(req.files.logo)
    }

    const nuevoEquipo = await Equipo.create({
      nombre,
      cantidad_deportistas,
      logo: imagePath,
      entrenador_id: entrenador_id || null,
      club_id,
    });

    res
      .status(200)
      .json({ msg: "Equipo creado correctamente", equipo: nuevoEquipo });
  } catch (error) {
    console.error("Error al crear el equipo:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

const modificarEquipo = async (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.body;

  try {
    const equipo = await Equipo.findByPk(id);

    if (!equipo) {
      return res.status(404).json({ msg: "Equipo no encontrado" });
    }

    await equipo.update(datosActualizados);

    res.status(200).json({ msg: "Equipo actualizado correctamente", equipo });
  } catch (error) {
    console.error("Error al modificar el equipo:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

const borrarEquipo = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await Equipo.destroy({ where: { id } });

    if (!resultado) {
      return res.status(404).json({ msg: "Equipo no encontrado" });
    }

    res.status(200).json({ msg: "Equipo eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el equipo:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};


const obtenerEquipoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const equipo = await Equipo.findByPk(id);
        console.log(id)
        if (!equipo) {
            return res.status(404).json({ msg: "Equipo no encontrado" });
        }

        res.status(200).json(equipo);
    } catch (error) {
        console.error("Error al obtener el equipo:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};


const obtenerMisEquipos = async (req, res) => {
  const { user_id } = req.user;

  try {

    const equipos = await UsuarioEquipo.findAll({
      where: {
        usuario_id: user_id
      },
      include: [
        {
          model: Equipo,
          include: [
            {
              model: Club
            }
          ]
        }
      ]
    });

    res.status(200).json(equipos);

  } catch (error) {
    console.error("Error al obtener los equipos:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
}

module.exports = {
  crearEquipo,
  modificarEquipo,
  borrarEquipo,
  obtenerEquipoPorId,
  obtenerMisEquipos
};
