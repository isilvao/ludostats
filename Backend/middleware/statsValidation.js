const Estadistica = require('../models/Estadistica');
const User = require('../models/Usuario');

const validateDeportista = async (req, res, next) => {
    const {id_usuario} = req.params

    try {
        const user = await User.findByPk(id_usuario)

        if (!user || user.rol !== 'deportista'){
            res.status(400).send({msg: "No se pudieron obtener las estadisticas"})
        } else {
            next()
        }

    } catch (error) {
        res.status(500).send({msg: "Error al consultar las estadisticas"})
    }
}

const validateAuthorizedUser = async (req, res, next) => {
    const {user_id} = req.user

    try {
        const user = await User.findByPk(user_id)

        if (!user || (user.rol !== 'gerente' && user.rol !== 'administrador' && user.rol !== 'entrenador')){
            res.status(400).send({msg: "No tienes permisos para editar o crear las estadisticas"})
        } else {
            next()
        }

    } catch (error) {
        res.status(500).send({msg: "Error al consultar las estadisticas"})
    }
}

module.exports = {
    validateDeportista,
    validateAuthorizedUser
}