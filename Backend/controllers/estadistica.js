//Controller
const Estadistica = require('../models/Estadistica');
const tipoEstadistica = require('../models/TipoEstadistica')
const Club = require('../models/Club')

async function getMyEstadisticas(req, res){
    const {id_usuario} = req.params

    try {
        const estadisticas = await Estadistica.findAll({where: {usuario_id: id_usuario}})
        res.status(200).send(estadisticas)
    } catch (error) {
        res.status(500).send({msg: "Error al consultar las estadisticas"})
    }
}

async function createEstadistica(req, res){
    const {id_tipoEstadistica, id_usuario} = req.params
    const {user_id} = req.user

    try {

        const tipoEstadistica = tipoEstadistica.findByPk(id_tipoEstadistica)

        if (!tipoEstadistica){
            return res.status(400).send({msg: "No se pudo encontrar el tipo de estadistica"})
        } else {
            const club = await Club.findByPk(tipoEstadistica.club_id)
            if (club.usuario_id !== user_id){
                return res.status(400).send({msg: "No tienes permisos para crear estadisticas en este club"})
            }
        }

        const estadistica = await Estadistica.create({
            tipoEstadistica_id: id_tipoEstadistica,
            usuario_id: id_usuario,
            valor: req.body.valor || 0,
            fecha : new Date()
        }).then((tipoEstadistica) => {
            if (!tipoEstadistica){
                return res.status(400).send({msg: "No se pudo crear la estadistica"})
            }
            return res.status(200).send(tipoEstadistica)
        }).catch((err) => {
            return res.status(500).send({msg: "Error al crear la estadistica"})
        })
    } catch (error) {
        return res.status(500).send({msg: "Error al crear la estadistica"})
    }
}

module.exports = {
    getMyEstadisticas,
    createEstadistica
}