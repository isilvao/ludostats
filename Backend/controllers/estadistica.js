//Controller
const Estadistica = require('../models/Estadistica');
const tipoEstadistica = require('../models/TipoEstadistica')
const Club = require('../models/Club')
const Usuario = require('../models/Usuario')
const UsuarioClub = require('../models/UsuarioClub')
const UsuariosEquipos = require('../models/UsuariosEquipos')

async function getMyEstadisticas(req, res){
    const {user_id} = req.user

    try {
        const estadisticas = await Estadistica.findAll({where: {usuario_id: user_id}})
        res.status(200).send(estadisticas)
    } catch (error) {
        res.status(500).send({msg: "Error al consultar las estadisticas"})
    }
}

async function createEstadistica(req, res){
    const {id_tipoestadistica, id_usuario} = req.params
    const {user_id} = req.user

    const {valor, fecha} = req.body


    try {

        const tipEstadistica = await tipoEstadistica.findOne({where: {id: id_tipoestadistica}})

        if (!tipEstadistica){
            return res.status(400).send({msg: "No se pudo encontrar el tipo de estadistica"})
        } else {
            const usuario = await Usuario.findOne({where: {id: user_id}})

            if (usuario.rol !== 'gerente'){
                const userClub = await UsuarioClub.findOne({where: {usuario_id: user_id, club_id: tipEstadistica.club_id}})
                if (!userClub){
                    return res.status(400).send({msg: "No tienes permisos para crear estadisticas en este club"})
                }
            } else {
                const club = await Club.findOne({where: {id: tipEstadistica.club_id}})
                if (club.gerente_id !== user_id){
                    return res.status(400).send({msg: "No tienes permisos para crear estadisticas en este club"})
                }
            }
        }

        await Estadistica.create({
            tipoEstadistica_id: id_tipoestadistica,
            usuario_id: id_usuario,
            valor: valor,
            fecha : fecha
        }).then((tipEstadistica) => {
            if (!tipEstadistica){
                return res.status(400).send({msg: "No se pudo crear la estadistica"})
            }
            return res.status(200).send(tipEstadistica)
        }).catch((err) => {
            return res.status(500).send({msg: "Error al crear la estadistica"})
        })
    } catch (error) {
        return res.status(500).send({msg: "Error al crear la estadistica", error})
    }
}

async function updateEstadistica(req, res){
    const {id_estadistica} = req.params

    try {
        Estadistica.update({
            valor: req.body.valor,
            fecha: req.body.fecha
        }, {where: {id: id_estadistica}}).then((estadistica) => {
            if (!estadistica){
                return res.status(400).send({msg: "No se pudo encontrar la estadistica"})
            }
            return res.status(200).send(estadistica)
        }).catch((err) => {
            return res.status(500).send({msg: "Error al actualizar la estadistica"})
        })

    } catch (error) {
        return res.status(500).send({msg: "Error al actualizar la estadistica"})
    }
}

async function deleteEstadistica(req, res){
    const {id_estadistica} = req.params

    try {
        await Estadistica.destroy({where: {id: id_estadistica}}).then((estadistica) => {
            if (!estadistica){
                return res.status(400).send({msg: "No se pudo encontrar la estadistica"})
            }
            return res.status(200).send(estadistica)
        }).catch((err) => {
            return res.status(500).send({msg: "Error al eliminar la estadistica"})
        })

    } catch (error) {
        return res.status(500).send({msg: "Error al eliminar la estadistica"})
    }
}

async function getAllEstadisticas(req, res){
    const {id_tipoestadistica} = req.params

    try {
        const usuarios = await Estadistica.findAll({
            where: {tipoEstadistica_id: id_tipoestadistica},
            include: {
                model: Usuario,
                as: "usuario",
                attributes: ['nombre', 'apellido']
            }
        })

        return res.status(200).send(usuarios)
    }catch (error){
        return res.status(500).send({msg: "Error al consultar las estadisticas"})
    }
}

// TODO: Implementar la función getAllEstadisticasInTeam
async function getAllEstadisticasInTeam(req, res){
    const {id_tipoestadistica, id_team} = req.params

    try {
        const usuarios = await UsuariosEquipos.findAll({
            where: {equipo_id: id_team, rol: 'deportista'},
            include: {
                model: Usuario,
                as: "usuario",
                attributes: ['nombre', 'apellido'],
                include: {
                    model: Estadistica,
                    as: "estadisticas",
                    where: {tipoEstadistica_id: id_tipoestadistica}
                }
            }
        })

        const estadisticas = usuarios.flatMap(usuarios =>
            usuarios.usuario.estadisticas.map(estadistica => ({
                id: estadistica.id,
                usuario_id: estadistica.usuario_id,
                tipoEstadistica_id: estadistica.tipoEstadistica_id,
                valor: estadistica.valor,
                fecha: estadistica.fecha,
                createdAt: estadistica.createdAt,
                updatedAt: estadistica.updatedAt,
                usuario: {
                    nombre: usuarios.usuario.nombre,
                    apellido: usuarios.usuario.apellido
                }
            }))
        );

        return res.status(200).send(estadisticas)
    } catch (error) {
        return res.status(500).send({msg: "Error al consultar las estadisticas", error})
    }
}

module.exports = {
    getMyEstadisticas,
    createEstadistica,
    updateEstadistica,
    deleteEstadistica,
    getAllEstadisticas,
    getAllEstadisticasInTeam
}