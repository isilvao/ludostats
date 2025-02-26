const express = require("express");
const multiparty = require("connect-multiparty");
const userController = require("../controllers/user");
const md_auth = require("../middleware/authenticate");
const md_clubOwn = require("../middleware/clubValidations");

const api = express.Router();
const md_upload = multiparty({ uploadDir: "./uploads/usersFoto" });

const upload = require("../middleware/upload"); // 📌 Importamos el middleware

// Personal Routes
api.get('/user/me', [md_auth.asureAuth], userController.getMe)

//api.patch('/user/updateMe', [md_auth.asureAuth, md_upload], userController.updateMe)
api.patch('/user/updateMe', [md_upload], userController.updateMe)
api.patch("/user2/:id", userController.updatePassword);
api.get("/user/email", userController.getUserByEmail);
api.delete("/user/deleteAccount", [md_auth.asureAuth], userController.deleteMe);

api.patch('/user/updatePasswordFromProfile/:id', userController.updatePasswordFromProfile)

// General Routes
api.get('/users', [md_auth.asureAuth], userController.getUsers)
api.post('/user', [md_auth.asureAuth, md_upload], userController.createUser)
//api.patch('/user/:id', [md_auth.asureAuth, md_upload], userController.updateUser)
api.patch('/user/:id', [md_upload], userController.updateUser)
api.get("/user/me", [md_auth.asureAuth], userController.getMe);
api.delete("/user/:id", [md_auth.asureAuth], userController.deleteUser);

//Acudiente
api.get("/children", [md_auth.asureAuth], userController.getMyChildren);
api.get("/children/:id_child", [md_auth.asureAuth], userController.getOneChild);

// Equipos
api.get("/usuarios/:usuario_id/equipos", userController.buscarEquiposUsuario);

// Club Routes
api.post("/joinClub/:id_club", [md_auth.asureAuth], userController.userJoinsClub);
api.delete("/leaveclub/:id_club", [md_auth.asureAuth], userController.userLeavesClub);
api.delete("/removeuserfromclub/:id_club/:id_user", userController.eliminarUsuarioClub);

api.get("/usuarios/:usuario_id/clubs", [md_auth.asureAuth], userController.buscarClubesUsuario);

api.patch("/user_foto/:id", upload.single("foto"), userController.actualizarFotoUsuario);

api.post("/send-email/user", userController.sendEmail)

api.post("/send-email/user/login", userController.sendVerificationEmail1)

api.patch("/activateUser", userController.activateUser)

api.get("/isAccountValid/:id", userController.isAccountValid)






module.exports = api;

