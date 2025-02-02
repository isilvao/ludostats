const express = require("express");
const multiparty = require("connect-multiparty");
const userController = require("../controllers/user");
const md_auth = require("../middleware/authenticate");
const md_clubOwn = require("../middleware/clubValidations");
const md_user = require("../middleware/userValidation");
const invitacionController = require("../controllers/invitacion");

const api = express.Router();
const md_upload = multiparty({ uploadDir: "./uploads/usersFoto" });

// Personal Routes
api.get("/user/me", [md_auth.asureAuth], userController.getMe);
api.patch(
  "/user/updateMe",
  [md_auth.asureAuth, md_upload],
  userController.updateMe
);

// General Routes
api.get("/users", [md_auth.asureAuth], userController.getUsers);
api.post("/user", [md_auth.asureAuth, md_upload], userController.createUser);
api.patch(
  "/user/:id",
  [md_auth.asureAuth, md_upload],
  userController.updateUser
);
api.patch("/user2/:id", userController.updatePassword);
api.delete("/user/:id", [md_auth.asureAuth], userController.deleteUser);
api.get("/user/email", userController.getUserByEmail);

// Invitaciones
api.post("/invitaciones", invitacionController.generarInvitacion);
api.get("/invitaciones/:clave", invitacionController.verificarInvitacion);
api.patch(
  "/invitaciones/:clave/usar",
  invitacionController.marcarInvitacionUsada
);
api.delete("/invitaciones/:clave", invitacionController.eliminarInvitacion);

api.get("/usuarios/:usuario_id/equipos", userController.buscarEquiposUsuario);
api.get("/usuarios/:usuario_id/clubs", userController.buscarClubesUsuario);

// Club Routes
api.get(
  "/:id_club/users",
  [
    md_auth.asureAuth,
    md_clubOwn.validateAdmin,
    md_clubOwn.validateAdminClubOwnership,
  ],
  userController.getUsersByClub
);
api.post(
  "/joinClub/:id_club",
  [md_auth.asureAuth],
  userController.userJoinsClub
);
api.delete(
  ":id_club/leaveclub/",
  [md_auth.asureAuth],
  userController.userLeavesClub
);
api.delete(
  ":id_club/removeuserfromclub/:id_user",
  [
    md_auth.asureAuth,
    md_clubOwn.validateAdmin,
    md_clubOwn.validateAdminClubOwnership,
  ],
  userController.eliminarUsuarioClub
);

//Acudiente
api.get("/children", [md_auth.asureAuth], userController.getMyChildren);
api.get(
  "/children/:id_child",
  [md_auth.asureAuth, md_user.validateChildOrFamily],
  userController.getOneChild
);

module.exports = api;
