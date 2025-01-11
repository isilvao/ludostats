const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt");

function register(req, res){
    const { nombre, apellido, correo, contrasena} = req.body;

    if (!correo) res.status(400).send({msg: "El correo es obligatorio"})
    if (!contrasena) res.status(400).send({msg: "La contraseña es obligatoria"})
    if (!nombre) res.status(400).send({msg: "El nombre es obligatorio"})
    if (!apellido) res.status(400).send({msg: "El apellido es obligatorio"})


    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(contrasena, salt);

    Usuario.create({
        nombre,
        apellido,
        correo: correo.toLowerCase(),
        contrasena: hashPassword,
        activo: false,
        rol: "externo"
    }).then((userStored) => {
        // userStored es la instancia creada
        if (!userStored) {
            return res.status(400).send({ msg: "Error al crear el usuario" });
        }
        return res.status(200).send({ msg: "Usuario creado correctamente", user: userStored });
    }).catch((err) => {
        console.error(err);
        return res.status(500).send({ msg: "Error al crear el usuario" });
    });

}

function login(req, res){
    const {correo, contrasena} = req.body;

    if (!correo) res.status(400).send({msg: "El correo es obligatorio"})
    if (!contrasena) res.status(400).send({msg: "La contraseña es obligatoria"})

    const emailLowerCase = correo.toLowerCase();

    Usuario.findOne({where:{
        correo: emailLowerCase
    }}).then(user => {
        if (!user) {
            res.status(404).send({msg: "No se ha podido ingresar"});
        } else {
            bcrypt.compare(contrasena, user.contrasena, (err, check) => {
                if (err) {
                    res.status(500).send({msg: "Error del servidor"});
                } else if (!check) {
                    res.status(404).send({msg: "No se pudo ingresar al usuario"});
                } else if (!user.activo) {
                    res.status(401).send({msg: "El usuario no está activo"});
                } else {
                    res.status(200).send({
                        accessToken: jwt.createAccessToken(user),
                        refreshToken: jwt.createRefreshToken(user),
                        user: user
                    });
                }
            });
        }
    }).catch(err => {
        res.status(500).send({msg: "Error del servidor"});
    });
}

function refreshAccessToken(req,res){
    const { token } = req.body;

    const { user_id } = jwt.decodeToken(token);

    Usuario.findOne({where: {id: user_id}}).then(user => {
        if (!user) {
            res.status(404).send({msg: "Usuario no encontrado"});
        } else {
            res.status(200).send({
                accessToken: jwt.createAccessToken(user),
            });
        }
    }).catch(err => {
        res.status(500).send({msg: "Error del servidor"});
    });
}

function getUsers(req, res){
    Usuario.findAll().then(users => {
        res.status(200).send(users);
    }).catch(err => {
        res.status(500).send({msg: "Error del servidor"});
    });
}

module.exports = {
    register,
    login,
    refreshAccessToken,
    getUsers
}