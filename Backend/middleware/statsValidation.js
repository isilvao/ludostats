const TipoEstadistica = require('../models/TipoEstadistica');
const UsuarioClub = require('../models/UsuarioClub');

const validateCoachOrGerenteByStatType = async (req, res, next) => {
    const {user_id} = req.user
    const {id_tipoestadistica} = req.params

    try {
        const response = await TipoEstadistica.findOne({where: {id: id_tipoestadistica}})

        if (!response){
            return res.status(400).send({msg: "No existe este tipo de estadistica"})
        } else {
            const usuarioClub = await UsuarioClub.findOne({where: {usuario_id: user_id, club_id: response.club_id}})
            if (usuarioClub.rol !== 'gerente' && usuarioClub.rol !== 'entrenador'){
                if (response.usuario_id !== user_id){
                    return res.status(400).send({msg: "No tienes permisos para editar esta estadistica"})
                }
            } else {
                next()
            }
        }
    } catch (error) {
        return res.status(500).send({msg: "Error al validar los permisos"})
    }
}

const validateCoachOrGerenteOrAdminByStatType = async (req, res, next) => {
    const {user_id} = req.user
    const {id_tipoestadistica} = req.params

    try {
        const response = await TipoEstadistica.findOne({where: {id: id_tipoestadistica}})

        if (!response){
            return res.status(400).send({msg: "No existe este tipo de estadistica"})
        } else {
            const usuarioClub = await UsuarioClub.findOne({where: {usuario_id: user_id, club_id: response.club_id}})
            if (usuarioClub.rol !== 'gerente' && usuarioClub.rol !== 'entrenador' && usuarioClub.rol !== 'administrador'){
                if (response.usuario_id !== user_id){
                    return res.status(400).send({msg: "No tienes permisos para editar esta estadistica"})
                }
            } else {
                next()
            }
        }
    } catch (error) {
        return res.status(500).send({msg: "Error al validar los permisos"})
    }
}

const validateStatTypeOnClub = async (req, res, next) => {
    const {id_club, id_tipoestadistica} = req.params

    try {
        const response = await TipoEstadistica.findOne({where: {id: id_tipoestadistica, club_id: id_club}})

        if (!response){
            return res.status(400).send({msg: "No se encontró el tipo de estadistica en este club"})
        } else {
            next()
        }
    } catch (error) {
        return res.status(500).send({msg: "Error al validar los permisos"})
    }
}

const validateUserInClubFromStatType = async (req, res, next) => {
    const {id_tipoestadistica, id_usuario} = req.params

    try {
        const response = await TipoEstadistica.findOne({where: {id: id_tipoestadistica}})

        if (!response){
            return res.status(400).send({msg: "No se encontró el tipo de estadistica"})
        } else {
            const userClub = await UsuarioClub.findOne({where: {usuario_id: id_usuario, club_id: response.club_id}})

            if (!userClub){
                return res.status(400).send({msg: "No tienes permisos en este club"})
            } else {
                next()
            }
        }
    } catch (error) {
        return res.status(500).send({msg: "Error al validar los permisos"})
    }
}

module.exports = {
    validateCoachOrGerenteByStatType,
    validateStatTypeOnClub,
    validateUserInClubFromStatType,
    validateCoachOrGerenteOrAdminByStatType
}