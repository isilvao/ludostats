const Club = require('../models/Club');
const User = require('../models/Usuario');
const UsuarioClub = require('../models/UsuarioClub');

const validateClubOwnership = async (req, res, next) => {
    const { id_club } = req.params
    const { user_id } = req.user


    try {
        const club = await Club.findOne({where: {id: id_club, gerente_id: user_id}})

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
    const {user_id} = req.user

    try {
        const usuario = await User.findByPk(user_id)

        if (usuario.rol !== 'gerente'){
            res.status(400).send({msg: "No tienes permisos en los Clubes"})
        } else {
            next()
        }
    }catch (err){
        res.status(500).send({msg: "Error al acceder a Clubes", err})
    }
}

const validateAdmin = async (req, res, next) => {
    const {user_id} = req.user

    try {
        const usuario = await User.findByPk(user_id)

        if (usuario.rol !== 'gerente' && usuario.rol !== 'administrador'){
            res.status(400).send({msg: "No tienes permisos en los Clubes"})
        } else {
            req.completeData = usuario
            next()
        }
    }catch (err){
        res.status(500).send({msg: "Error al acceder a Clubes", err})
    }
}

const validateAdminClubOwnership = async (req, res, next) => {
    const { id_club } = req.params
    const user  = req.completeData

    let club = null

    try {
        if (user.rol === 'administrador'){
            club = await UsuarioClub.findOne({where: {usuario_id: user.id, club_id: id_club}, include: [{model: Club, as: 'club'}]})
        } else {
            club = await Club.findOne({where: {id: id_club, gerente_id: user.id}})
        }

        if (!club){
            res.status(400).send({msg: "Error al ingresar al club"})
        } else {
            req.club = club
            next()
        }

    } catch (err){
        res.status(500).send({msg: "Error al validar la propiedad del club"})
    }
}

const validateStatisticsTypeUserOwnership = async (req, res, next) => {
    const user  = req.usuario
    const { id_club } = req.params

    try {
        let club = null;

        if (user.rol === 'gerente'){
            club = await Club.findOne({where: {id: id_club, gerente_id: user.id}})
        } else {
            club = await UsuarioClub.findOne({where: {usuario_id: user.id, club_id: id_club}})
        }

        if (!club){
            res.status(400).send({msg: "No tienes permisos para consultar las estadisticas"})
        } else {
            next()
        }
    } catch (error) {
        res.status(500).send({msg: "Error al validar los permisos para el club"})
    }
}

module.exports = {
    validateClubOwnership,
    validateGerente,
    validateAdmin,
    validateAdminClubOwnership,
    validateStatisticsTypeUserOwnership
}