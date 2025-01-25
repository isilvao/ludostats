//Controller
const Estadistica = require('../models/Estadistica');

async function getMyEstadisticas(req, res){
    const {id_usuario} = req.params

    try {
        const estadisticas = await Estadistica.findAll({where: {usuario_id: id_usuario}})
        res.status(200).send(estadisticas)
    } catch (error) {
        res.status(500).send({msg: "Error al consultar las estadisticas"})
    }
}


module.exports = {
    getMyEstadisticas,
    
}