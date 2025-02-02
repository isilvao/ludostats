const image = require("../utils/image");
const Club = require('../models/Club');
const UsuarioClub = require('../models/UsuarioClub');
const Equipo = require('../models/Equipo');

async function getClubs(req, res){

    const user = req.completeData;
    let response = null

    if (user.rol === 'administrador'){
        response = await UsuarioClub.findAll({where: {usuario_id: user.id}, include: [{model: Club, as: 'club'}]})
        response = response.map((club) => club.club)
    } else {
        response = await Club.findAll({where: {gerente_id: user.id}})
    }

    if (!response) {
        res.status(404).send({msg: "No se han encontrado los clubes"})
    } else {
        res.status(200).send(response)
    }
}

async function createClub(req, res){
    /**
     * req.body
     * - Nombre
     * - Deporte
     * - Telefono (opcional)
     * - Logo (opcional)
     */

    const { user_id } = req.user;

    let imagePath = null

    if (req.files.logo){
        imagePath = image.getFilePath(req.files.logo)
    }

    Club.create({
        ...req.body,
        gerente_id: user_id,
        logo: imagePath,
    }).then((clubStored) => {
        if (!clubStored) {
            res.status(400).send({ msg: "Error al crear el club" });
        }else {
            res.status(200).send({ msg: "Club creado correctamente", club: clubStored, success: true });
        }
    }).catch((err) => {
        console.error(err);
        res.status(500).send({ msg: "Error al crear el club" });
    });

}

async function updateClub(req, res){
    const { id_club } = req.params

    const club = req.club

    const userData = req.body

    if (req.files.logo){
        imagePath = image.getFilePath(userData.logo)
    } else {
        imagePath = null
    }

    club.update(userData, {where: {id: id_club}}).then((response) => {
        if (!response) {
            res.status(404).send({msg: "No se ha encontrado el club"})
        } else {
            res.status(200).send({msg: "Club actualizado correctamente", success: true})
        }
    }).catch((err) => {
        res.status(500).send({msg: "Error al actualizar el club"})
    })
}

async function deleteClub(req, res){
    const { id_club } = req.params

    const club = req.club

    club.destroy({where: {id: id_club}}).then((response) => {
        if (!response) {
            res.status(404).send({msg: "No se ha encontrado el club"})
        } else {
            res.status(200).send({msg: "Club eliminado correctamente", success: true})
        }
    }).catch((err) => {
        res.status(500).send({msg: "Error al eliminar el club"})
    })
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
    const { equipo_id } = req.params;

    try {
        // Buscar el equipo para obtener el club_id
        const equipo = await Equipo.findByPk(equipo_id);

        if (!equipo) {
            return res.status(404).json({ msg: "Equipo no encontrado" });
        }

        // Buscar el club asociado al club_id del equipo
        const club = await Club.findByPk(equipo.club_id);

        if (!club) {
            return res.status(404).json({ msg: "Club no encontrado para el equipo proporcionado" });
        }

        res.status(200).json(club);
    } catch (error) {
        console.error("Error al buscar el club por equipo:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

const buscarMisClubes = async (req, res) => {
    const {user_id} = req.user

    try {
        const clubes = await UsuarioClub.findAll({ where: { usuario_id: user_id }, include: [{ model: Club, as: 'club' }] });
        const clubesResponse = clubes.map((club) => club.club);

        res.status(200).json(clubesResponse);
    } catch (error) {
        console.error("Error al buscar los clubes del usuario:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
}


module.exports = {
    getClubs,
    createClub,
    updateClub,
    deleteClub,
    encontrarClubPorId,
    encontrarClubPorEquipoId,
    buscarMisClubes
}