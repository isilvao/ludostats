const Club = require('../models/Club');
const User = require('../models/Usuario');

const validateClubOwnership = async (req, res, next) => {
    const { id_club, id_gerente } = req.params

    try {
        const club = await Club.findOne({where: {id: id_club, gerente_id: id_gerente}})

        if (!club){
            res.status(400).send({msg: "No tienes permisos para modificar este club"})
        } else {
            req.club = club
            next()
        }

    }catch (err){
        res.status(500).send({msg: "Error al validar la propiedad del club"})
    }
}

const validateGerente = async (req, res, next) => {
    const { id_gerente } = req.params

    try {
        const usuario = await User.findByPk(id_gerente)

        if (usuario.rol !== 'gerente'){
            res.status(400).send({msg: "No tienes permisos para modificar este club"})
        } else {
            next()
        }

    }catch (err){
        res.status(500).send({msg: "Error al validar la propiedad del club", err})
    }
}

module.exports = {
    validateClubOwnership,
    validateGerente
}