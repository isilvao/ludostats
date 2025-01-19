const image = require("../utils/image");
const Club = require('../models/Club');

async function getClubs(req, res){

    const { id_gerente } = req.params;

    const response = await Club.findAll({where: {gerente_id: id_gerente}})

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

    const { id_gerente } = req.params;

    let imagePath = null

    if (req.files.logo){
        imagePath = image.getFilePath(req.files.logo)
    }

    Club.create({
        ...req.body,
        gerente_id: id_gerente,
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
    const {id_club } = req.params

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

module.exports = {
    getClubs,
    createClub,
    updateClub,
    deleteClub
}