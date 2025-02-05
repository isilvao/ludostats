const Equipo = require("../models/Equipo");
const Usuario = require("../models/Usuario");
const Club = require("../models/Club");
const UsuariosEquipos = require("../models/UsuariosEquipos");
const { Op } = require("sequelize"); // 📌 Importamos operadores de Sequelize

const crearEquipo = async (req, res) => {
  const { nombre, club_id, entrenador_id, nivelPractica, descripcion } =
    req.body;

  if (!nombre || !club_id || !nivelPractica) {
    return res.status(400).json({ msg: "Faltan datos obligatorios" });
  }

  try {

    let imagePath = null

    if (req.files.logo){
        imagePath = image.getFilePath(req.files.logo)
    }

    const nuevoEquipo = await Equipo.create({
      nombre,
      logo: imagePath,
      descripcion: descripcion,
      entrenador_id: entrenador_id || null,
      club_id,
      nivelPractica,
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
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ msg: "Falta el parámetro user_id" });
    }

    try {
        // 📌 1️⃣ Equipos donde el usuario está registrado en UsuariosEquipos
        const equiposRegistrados = await UsuariosEquipos.findAll({
            where: { usuario_id: user_id },
            include: [
                {
                    model: Equipo,
                    include: [
                        {
                            model: Club,
                            as: "club",
                        }
                    ]
                }
            ]
        });

        console.log("📌 Equipos encontrados en UsuariosEquipos:", equiposRegistrados);

        // 📌 Extraer correctamente los equipos del usuario
        const equiposUsuario = equiposRegistrados
            .filter(er => er.Equipo) // 🔹 Aseguramos que `Equipo` no sea undefined
            .map(er => {
                const equipo = er.Equipo;
                const club = equipo.club || null;
                
                return {
                    id: equipo.id,
                    nombre: equipo.nombre,
                    descripcion: equipo.descripcion,
                    nivelPractica: equipo.nivelPractica,
                    logo: equipo.logo,
                    entrenador_id: equipo.entrenador_id,
                    club_id: equipo.club_id,
                    createdAt: equipo.createdAt,
                    updatedAt: equipo.updatedAt,
                    club: club ? {  // 📌 Asegurar estructura del club
                        id: club.id,
                        gerente_id: club.gerente_id,
                        nombre: club.nombre,
                        deporte: club.deporte,
                        telefono: club.telefono,
                        logo: club.logo,
                        createdAt: club.createdAt,
                        updatedAt: club.updatedAt
                    } : null
                };
            });

        // 📌 2️⃣ Equipos donde el usuario es gerente del club
        const clubesComoGerente = await Club.findAll({
            where: { gerente_id: user_id },
            include: [
                {
                    model: Equipo,
                    as: "equipos",
                    include: [
                        {
                            model: Club,
                            as: "club"
                        }
                    ]
                }
            ]
        });

        console.log("📌 Equipos encontrados como gerente:", clubesComoGerente);

        // 📌 Extraer los equipos del gerente
        const equiposComoGerente = clubesComoGerente.flatMap(club =>
            club.equipos.map(equipo => ({
                id: equipo.id,
                nombre: equipo.nombre,
                descripcion: equipo.descripcion,
                nivelPractica: equipo.nivelPractica,
                logo: equipo.logo,
                entrenador_id: equipo.entrenador_id,
                club_id: equipo.club_id,
                createdAt: equipo.createdAt,
                updatedAt: equipo.updatedAt,
                club: equipo.club ? {  // 📌 Asegurar estructura del club
                    id: equipo.club.id,
                    gerente_id: equipo.club.gerente_id,
                    nombre: equipo.club.nombre,
                    deporte: equipo.club.deporte,
                    telefono: equipo.club.telefono,
                    logo: equipo.club.logo,
                    createdAt: equipo.club.createdAt,
                    updatedAt: equipo.club.updatedAt
                } : null
            }))
        );

        // 📌 3️⃣ Unir ambos resultados y eliminar duplicados
        const equiposUnicos = [...new Map(
            [...equiposUsuario, ...equiposComoGerente].map(e => [e.id, e])
        ).values()];

        res.status(200).json(equiposUnicos);
    } catch (error) {
        console.error("❌ Error al obtener los equipos:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};














module.exports = {
  crearEquipo,
  modificarEquipo,
  borrarEquipo,
  obtenerEquipoPorId,
  obtenerMisEquipos
};
