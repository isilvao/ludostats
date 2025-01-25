const User = require('../models/Usuario');

const validateAdmin = async (req, res, next) => {
    const {user_id} = req.user

    try {
        const usuario = await User.findByPk(user_id)

        if (usuario.rol !== 'gerente' && usuario.rol !== 'administrador'){
            res.status(400).send({msg: "No tienes permisos en los Clubes"})
        } else {
            next()
        }
    }catch (err){
        res.status(500).send({msg: "Error al acceder a Clubes", err})
    }
}

const validateChildOrFamily = async (req, res, next) => {
    const {user_id} = req.user

    try {
        const user = await User.findByPk(user_id)

        if (user.rol !== 'deportista' && user.rol !== 'acudiente'){
            res.status(400).send({msg: "No tienes permisos para acceder a la informacion del usuario"})
        } else {
            next()
        }
    } catch (error) {
        res.status(500).send({msg: "Error al acceder a la informacion del usuario", err})
    }
}

module.exports = {
    validateAdmin,
    validateChildOrFamily
}