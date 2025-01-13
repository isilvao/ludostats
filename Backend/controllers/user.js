const User = require('../models/Usuario')

async function getMe(req, res){

    const {user_id} = req.user

    const response = await User.findByPk(user_id)

    if (!response) {
        res.status(404).send({msg: "No se ha encontrado el usuario"})
    } else {
        res.status(200).send(response)
    }
}

async function getUsers(req, res){
    const { activo, rol } = req.query;
    let response = null

    if (activo === undefined){
        response = await User.findAll();
    } else{
        response = await User.findAll({where: {activo, rol}});
    }

    res.status(200).send(response)
}

module.exports = {
    getMe,
    getUsers
}