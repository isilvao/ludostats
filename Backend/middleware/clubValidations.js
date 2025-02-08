const TipoEstadistica = require('../models/TipoEstadistica');
const UsuarioClub = require('../models/UsuarioClub');

const validateGerenteInClub = async (req, res, next) => {
    const {user_id} = req.user
    const {id_club} = req.params

    try {
        const response = await UsuarioClub.findOne({where: {usuario_id: user_id, club_id: id_club}})

        if (!response){
            return res.status(400).send({msg: "No pertenece a este club"})
        } else if (response.rol !== 'gerente'){
            return res.status(400).send({msg: "No tienes permisos en este club"})
        } else {
            next()
        }

    } catch (error) {
        return res.status(500).send({msg: "Error al validar los permisos"})
    }
}

const validateAdminOrGerenteOrCoachInClub = async (req, res, next) => {
    const {user_id} = req.user
    const {id_club} = req.params

    try {
        const response = await UsuarioClub.findOne({where: {usuario_id: user_id, club_id: id_club}})

        if (!response){
            return res.status(400).send({msg: "No pertenece a este club"})
        } else if (response.rol !== 'gerente' && response.rol !== 'administrador' && response.rol !== 'entrenador'){
            return res.status(400).send({msg: "No tienes permisos en este club"})
        } else {
            next()
        }


    } catch (error) {
        return res.status(500).send({msg: "Error al validar los permisos"})
    }
}

const validateAdminOrGerenteInClub = async (req, res, next) => {
    const {user_id} = req.user
    const {id_club} = req.params

    try {
        const response = await UsuarioClub.findOne({where: {usuario_id: user_id, club_id: id_club}})

        if (!response){
            return res.status(400).send({msg: "No pertenece a este club"})
        } else if (response.rol !== 'gerente' && response.rol !== 'administrador'){
            return res.status(400).send({msg: "No tienes permisos en este club"})
        } else {
            next()
        }

    } catch (error) {
        return res.status(500).send({msg: "Error al validar los permisos"})
    }
}

const validateCoachOrGerenteInClub = async (req, res, next) => {
    const {user_id} = req.user
    const {id_club} = req.params

    try {
        const response = await UsuarioClub.findOne({where: {usuario_id: user_id, club_id: id_club}})

        if (!response){
            return res.status(400).send({msg: "No pertenece a este club"})
        } else if (response.rol !== 'gerente' && response.rol !== 'entrenador'){
            return res.status(400).send({msg: "No tienes permisos en este club"})
        } else {
            next()
        }
    } catch (error) {
        return res.status(500).send({msg: "Error al validar los permisos"})
    }
}


module.exports = {
    validateAdminOrGerenteOrCoachInClub,
    validateAdminOrGerenteInClub,
    validateCoachOrGerenteInClub,
    validateGerenteInClub
}