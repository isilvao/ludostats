const TipoEstadistica = require('../models/TipoEstadistica');
const User = require('../models/Usuario');


// TODO:
// Para hacer la validación necesito saber si el usuario pertenece al club
// Es necesario crear una nueva tabla en la base de datos
// La tabla se llamará UsuarioClub
// UsuarioClub tendrá dos campos: id_usuario y id_club
// Revisar diagrama ER y crea el modelo en el backend
// Luego crea la relación en el modelo de Usuario
// Luego crea la relación en el modelo de Club

const validateAuthorizedUser = async (req, res, next) => {
    const {user_id} = req.user

    try {
        const user = await User.findByPk(user_id)

        if (!user || (user.rol !== 'gerente' && user.rol !== 'administrador' && user.rol !== 'entrenador')){
            res.status(400).send({msg: "No tienes permisos para consultar los tipos de estadisticas"})
        } else {
            req.usuario = user
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