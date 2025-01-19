const TipoEstadistica = require('../models/TipoEstadistica');
const User = require('../models/Usuario');

const validateAuthorizedUser = async (req, res, next) => {
    const {user_id} = req.user

    try {
        const user = await User.findByPk(user_id)

        if (!user || (user.rol !== 'gerente' && user.rol !== 'administrador' && user.rol !== 'entrenador')){
            res.status(400).send({msg: "No tienes permisos para consultar las estadisticas"})
        } else {
            next()
        }

    } catch (error) {
        res.status(500).send({msg: "Error al consultar las estadisticas"})
    }
}

const validateStadisticForClub = async (req, res, next) => {
    const {id_club, id_tipoestadistica} = req.params

    try {
        const tipoEstadistica = await TipoEstadistica.findOne({where: {id: id_tipoestadistica, club_id: id_club}})

        if (!tipoEstadistica){
            res.status(400).send({msg: "No tienes permisos para consultar las estadisticas"})
        } else {
            req.tipoEstadistica = tipoEstadistica
            next()
        }
    } catch (error) {
        res.status(500).send({msg: "Error al consultar las estadisticas"})
    }

}


module.exports = {
    validateAuthorizedUser,
    validateStadisticForClub
}