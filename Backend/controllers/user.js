const bcrypt = require('bcryptjs')
const image = require("../utils/image");
const User = require('../models/Usuario')
const UsuarioClub = require('../models/UsuarioClub')


//*********************     PERSONAL ROUTES     *********************
async function getMe(req, res){

    const {user_id} = req.user

    const response = await User.findOne({where: {id: user_id}, include: {model: User, as: 'acudiente'}})

    if (!response) {
        res.status(404).send({msg: "No se ha encontrado el usuario"})
    } else if (response.rol === 'deportista'){
        res.status(200).send(response)
        console.log(response)
    } else {
        response.acudiente = null
        res.status(200).send(response)

        console.log(response)
    }
}

async function updateMe(req, res){

    const {user_id} = req.user

    const userData = req.body

    delete userData.rol
    delete userData.equipo_id
    delete userData.acudiente_id

    if (userData.contrasena){
        const salt = bcrypt.genSaltSync(10)
        userData.contrasena = bcrypt.hashSync(userData.contrasena, salt)
    } else {
        delete userData.contrasena
    }

    if (req.files.foto){
        userData.foto = image.getFilePath(req.files.foto)
    }

    User.update(userData, {where: {id: user_id}}).then((response) => {
        if (!response[0]) {
            res.status(404).send({msg: "Error al actualizar el usuario"})
        } else {
            res.status(200).send({msg: "Usuario actualizado correctamente"})
        }
    }).catch((err) => {
        res.status(500).send({msg: "Error al actualizar el usuario"})
    })

}


//*********************     GENERAL ROUTES     *********************

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
            res.status(400).send({ msg: "Error al crear el usuario" });
        }
            res.status(200).send({ msg: "Usuario creado correctamente", user: userStored, success: true });
    }).catch((err) => {
        console.error(err);
            res.status(500).send({ msg: "Error al crear el usuario" });
    });
}

async function updateUser(req,res){
    const { id } = req.params
    const userData = req.body;

    const updaterUser = req.user;

    const user = await User.findByPk(updaterUser.user_id)

    if (user.rol !== 'administrador' && user.rol !== 'gerente'){
        delete userData.rol
        delete userData.equipo_id
        delete userData.acudiente_id
    }

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
    const { user_id } = req.user

    const user = await User.findByPk(user_id)

    if (user.rol !== 'administrador' && user.rol !== 'gerente'){
        res.status(400).send({msg: "No tienes permisos para eliminar un usuario"})
    }


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
//*********************     ACUDIENTE ROUTES     *********************

async function getMyChildren(req, res){
    const {user_id} = req.user

    try {
        const deportistas = await User.findAll({where: {acudiente_id: user_id}})

        if (!deportistas){
            res.status(404).send({msg: "No se han encontrado deportistas"})
        } else {
            res.status(200).send(deportistas)
        }
    } catch (error) {
        res.status(500).send({msg: "Error al obtener a los deportistas"})
    }
}

async function getOneChild(req, res){
    const { id_child } = req.params
    const {user_id} = req.user

    try {
        const acudiente = await User.findOne({
            where: { id: user_id },
            include: { model: User, as: 'dependientes' }
        });

        if (!acudiente) {
            return res.status(404).send({ msg: "No se ha encontrado el acudiente" });
        }
        console.log(id_child)
        console.log("dependientes IDs:", acudiente.dependientes.map(dep => dep.id));

        const dependiente = acudiente.dependientes.find(dependientes => dependientes.id.toString() === id_child);

        if (!dependiente) {
            return res.status(404).send({ msg: "No se ha encontrado el dependiente con el ID especificado" });
        }

        return res.status(200).send(dependiente);

    } catch (error) {
        console.error(error); // Log del error
        return res.status(500).send({ msg: "Error al obtener al deportista" });
    }
}

//*********************     CLUB ROUTES     *********************

async function userJoinsClub(req, res){
    const { id_club } = req.params
    const { user_id } = req.user

    const user = await User.findByPk(user_id)

    const response = await UsuarioClub.findOne({where: {club_id: id_club, usuario_id: user_id}})

    if (user.rol === 'gerente'){
        res.status(400).send({msg: "No puedes unirte a un club si eres gerente"})
    } else if (response){
        res.status(400).send({msg: "Ya te encuentras unido a este club"})
    } else {
        UsuarioClub.create({club_id: id_club, usuario_id: user_id}).then((response) => {
            res.status(200).send({msg: "Usuario unido al club correctamente", success: true})
        }).catch((err) => {
            res.status(500).send({msg: "Error al unir el usuario al club"})
        })
    }
}

async function getUsersByClub(req, res){
    const { id_club } = req.params

    try {
        const response = await UsuarioClub.findAll({
            where: { club_id: id_club },
            include: [
                {
                    model: User, // Modelo que estás incluyendo
                    as: 'usuario', // Alias que definiste en la asociación
                },
            ],
        });

        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al obtener los usuarios del club' });
    }
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
    getUsersByClub,
    updateMe,
    userJoinsClub,
    getOneChild,
    getMyChildren,
    getUserByEmail,
    updatePassword
}