const bcrypt = require('bcryptjs')
const image = require("../utils/image");
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

    if (activo === undefined || rol === undefined){
        response = await User.findAll();
    } else{
        response = await User.findAll({where: {activo, rol}});
    }

    res.status(200).send(response)
}

async function createUser(req, res){

    const { contrasena } = req.body

    const salt = bcrypt.genSaltSync(10)

    const hashedPassword = bcrypt.hashSync(contrasena, salt)

    let imagePath = null

    if (req.files.foto){
        imagePath = image.getFilePath(req.files.foto)
    }

    User.create({
        ...req.body,
        contrasena: hashedPassword,
        foto: imagePath,
    }).then((userStored) => {
        if (!userStored) {
            return res.status(400).send({ msg: "Error al crear el usuario" });
        }
        return res.status(200).send({ msg: "Usuario creado correctamente", user: userStored, success: true });
    }).catch((err) => {
        console.error(err);
        return res.status(500).send({ msg: "Error al crear el usuario" });
    });
}

async function updateUser(req,res){
    const { id } = req.params
    const userData = req.body;

    if (userData.contrasena){
        const salt = bcrypt.genSaltSync(10)
        userData.contrasena = bcrypt.hashSync(userData.contrasena, salt)
    } else {
        delete userData.contrasena
    }

    if (req.files.foto){
        userData.foto = image.getFilePath(req.files.foto)
    }

    User.update(userData, {where: {id}}).then((response) => {
        if (!response[0]) {
            res.status(404).send({msg: "No se ha encontrado el usuario"})
        } else {
            res.status(200).send({msg: "Usuario actualizado correctamente"})
            console.log("usuario actualizada correctamente")
        }
    }).catch((err) => {
        res.status(500).send({msg: "Error al actualizar el usuario"})
    })
}

async function updatePassword(req,res){
    const { id } = req.params
    const userData = req.body;

    if (userData.contrasena){
        const salt = bcrypt.genSaltSync(10)
        userData.contrasena = bcrypt.hashSync(userData.contrasena, salt)
    } else {
        delete userData.contrasena
    }


    User.update(userData, {where: {id}}).then((response) => {
        if (!response[0]) {
            res.status(404).send({msg: "No se ha encontrado el usuario"})
        } else {
            res.status(200).send({msg: "Usuario actualizado correctamente"})
            console.log("usuario actualizada correctamente")
        }
    }).catch((err) => {
        res.status(500).send({msg: "Error al actualizar el usuario"})
    })
}

async function deleteUser(req,res){
    const { id } = req.params

    User.destroy({where: {id}}).then((response) => {
        if (!response) {
            res.status(404).send({msg: "No se ha encontrado el usuario"})
        } else {
            res.status(200).send({msg: "Usuario eliminado correctamente", success: true})
        }
    }).catch((err) => {
        res.status(500).send({msg: "Error al eliminar el usuario"})
    })
}

async function getUserByEmail(req, res) {
    const { correo } = req.query; // Obtenemos "correo" desde los parámetros de consulta

    if (!correo) {
        return res.status(400).send({ msg: "El correo electrónico es requerido" });
    }

    try {
        const user = await User.findOne({ where: { correo } }); // Busca el usuario por correo

        if (!user) {
            console.log("el usuario no existe")
            return res.status(404).send({ msg: "Usuario no encontrado" });
            
        }
 
        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Error en el servidor" });
    }
}

module.exports = {
    getMe,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserByEmail,
    updatePassword
}