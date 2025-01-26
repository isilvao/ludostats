const bcrypt = require('bcryptjs')
const image = require("../utils/image");
const User = require('../models/Usuario')
const Invitacion = require('../models/invitacion');

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


const generarInvitacion = async (req, res) => {
    const { club_id, rol_invitado, creator_id, extra_id } = req.body;

    if (!club_id || !rol_invitado || !creator_id) {
        return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }

    try {
        const nuevaInvitacion = await Invitacion.create({
            club_id,
            rol_invitado,
            usado: false,
            fecha_exp: new Date(new Date().setDate(new Date().getDate() + 7)), // Expira en 7 días
            creator_id,
            extra_id: extra_id || null,
        });

        res.status(201).json({ msg: "Invitación creada correctamente", invitacion: nuevaInvitacion });
    } catch (error) {
        console.error("Error al crear la invitación:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

const verificarInvitacion = async (req, res) => {
    const { id } = req.params;

    try {
        const invitacion = await Invitacion.findByPk(id);

        if (!invitacion) {
            return res.status(404).json({ msg: "Invitación no encontrada" });
        }

        res.status(200).json(invitacion);
    } catch (error) {
        console.error("Error al verificar la invitación:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

const marcarInvitacionUsada = async (req, res) => {
    const { id } = req.params;

    try {
        const invitacion = await Invitacion.findByPk(id);

        if (!invitacion) {
            return res.status(404).json({ msg: "Invitación no encontrada" });
        }

        if (invitacion.usado) {
            return res.status(400).json({ msg: "La invitación ya ha sido utilizada" });
        }

        invitacion.usado = true;
        await invitacion.save();

        res.status(200).json({ msg: "Invitación marcada como usada" });
    } catch (error) {
        console.error("Error al actualizar la invitación:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

// Controlador para eliminar una invitación
const eliminarInvitacion = async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await Invitacion.destroy({ where: { id } });

        if (resultado === 0) {
            return res.status(404).json({ msg: "Invitación no encontrada" });
        }

        res.status(200).json({ msg: "Invitación eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar la invitación:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};


module.exports = {
    getMe,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserByEmail,
    updatePassword,
    generarInvitacion,
    verificarInvitacion,
    marcarInvitacionUsada,
    eliminarInvitacion
}