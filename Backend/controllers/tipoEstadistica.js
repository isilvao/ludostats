const TipoEstadistica = require('../models/TipoEstadistica');

async function getTipoEstadisticas(req, res){

    const { id_club } = req.params;

    const response = await TipoEstadistica.findAll({where: {club_id: id_club}})

    console.log("Llega a getTipoEstadisticas")
    console.log(response)

    if (!response) {
        return res.status(404).send({msg: "No se han encontrado los tipos de estadistica"})
    } else {
        return res.status(200).send(response)
    }
}

async function createTipoEstadistica(req, res){
    /**
     * req.body
     * - Nombre
     * - Descripcion
     */
    const { id_club } = req.params;

    TipoEstadistica.create({
        ...req.body,
        club_id: id_club,
    }).then((tipoEstadisticaStored) => {
        if (!tipoEstadisticaStored) {
            res.status(400).send({ msg: "Error al crear el tipo de estadistica" });
        }else {
            res.status(200).send({ msg: "Tipo de estadistica creado correctamente", tipoEstadistica: tipoEstadisticaStored, success: true });
        }
    }).catch((err) => {
        res.status(500).send({ msg: "Error al crear el tipo de estadistica" });
    });
}

async function updateTipoEstadistica(req, res){

    const tipoEstadistica = req.tipoEstadistica

    tipoEstadistica.update({
        ...req.body
    }).then((tipoEstadisticaStored) => {
        if (!tipoEstadisticaStored) {
            res.status(400).send({ msg: "Error al actualizar el tipo de estadistica" });
        }else {
            res.status(200).send({ msg: "Tipo de estadistica actualizado correctamente", tipoEstadistica: tipoEstadisticaStored, success: true });
        }
    }).catch((err) => {
        console.error(err);
        res.status(500).send({ msg: "Error al actualizar el tipo de estadistica" });
    });
}

async function deleteTipoEstadistica(req, res){
    const tipoEstadistica = req.tipoEstadistica

    tipoEstadistica.destroy().then(() => {
        res.status(200).send({msg: "Tipo de estadistica eliminado correctamente", success: true})
    }).catch((err) => {
        console.error(err);
        res.status(500).send({msg: "Error al eliminar el tipo de estadistica"})
    });
}


module.exports = {
    getTipoEstadisticas,
    createTipoEstadistica,
    updateTipoEstadistica,
    deleteTipoEstadistica
}