const UsuarioEquipo = require("../models/UsuariosEquipos");

const validateAdminOrGerenteInTeam = async (req, res, next) => {
    const {user_id} = req.user
    const {id_equipo} = req.params

    try {
        const response = await UsuarioEquipo.findOne({where: {usuario_id: user_id, equipo_id: id_equipo}})

        if (!response){
            return res.status(400).send({msg: "No pertenece a este equipo"})
        } else if (response.rol !== 'gerente' && response.rol !== 'administrador'){
            return res.status(400).send({msg: "No tienes permisos en este equipo"})
        } else {
            next()
        }

    } catch (error) {
        return res.status(500).send({msg: "Error al validar los permisos"})
    }
}

module.exports = {
    validateAdminOrGerenteInTeam
}