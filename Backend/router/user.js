const express = require("express");
const multiparty = require("connect-multiparty");
const userController = require("../controllers/user");
const md_auth = require("../middleware/authenticate");
const md_clubOwn = require("../middleware/clubValidations");

const api = express.Router();
const md_upload = multiparty({ uploadDir: "./uploads/usersFoto" });

const upload = require("../middleware/upload"); // 📌 Importamos el middleware

// Personal Routes
api.get('/user/me', [md_auth.asureAuth],userController.getMe)
api.patch('/user/updateMe', [md_auth.asureAuth, md_upload], userController.updateMe)
api.patch("/user2/:id", userController.updatePassword);
api.get("/user/email", userController.getUserByEmail);
api.delete("/user/deleteAccount", [md_auth.asureAuth], userController.deleteMe);

// General Routes
api.get('/users', [md_auth.asureAuth], userController.getUsers)
api.post('/user', [md_auth.asureAuth, md_upload], userController.createUser)
api.patch('/user/:id', [md_auth.asureAuth, md_upload], userController.updateUser)
api.get("/user/me", [md_auth.asureAuth], userController.getMe);
api.delete("/user/:id", [md_auth.asureAuth], userController.deleteUser);

//Acudiente
api.get("/children", [md_auth.asureAuth], userController.getMyChildren);
api.get("/children/:id_child",[md_auth.asureAuth],userController.getOneChild);

// Equipos
api.get("/usuarios/:usuario_id/equipos", userController.buscarEquiposUsuario);

// Club Routes
api.post("/joinClub/:id_club",[md_auth.asureAuth],userController.userJoinsClub);
api.get("/club/users/:id_club",userController.getUsersByClub);
api.delete(":id_club/leaveclub/",[md_auth.asureAuth],userController.userLeavesClub);
api.delete(":id_club/removeuserfromclub/:id_user",[md_auth.asureAuth, md_clubOwn.validateAdminOrGerenteInClub],userController.eliminarUsuarioClub);

api.get("/usuarios/:usuario_id/clubs", [md_auth.asureAuth], userController.buscarClubesUsuario);

api.patch("/user_foto/:id", upload.single("foto"), userController.actualizarFotoUsuario);

module.exports = api;

