const express = require('express')
const diegoController = require('../controllers/teams')
const api = express.Router()



api.get('/club/:club_id/usuario/:usuario_id', diegoController.obtenerInfoClubYRol);

api.get('/equipo/:equipo_id/usuario/:usuario_id', diegoController.obtenerInfoEquipoYRol);

//////////////////////////////////////
///////////////////////////////////
//RUTAS DE TRANSACCIONES

api.post('/crear-transaccion', diegoController.crearTransaccion);
api.get('/transacciones/:usuario_id', diegoController.obtenerTransaccionesPorUsuario);

//////////////////////////////////////
///////////////////////////////////
//RUTAS DE comprar membresia y matricula


api.post('/comprar-membresia', diegoController.comprarMembresia);
api.post('/comprar-matricula', diegoController.comprarMatricula);

//////////////////////////////////////
///////////////////////////////////
//RUTAS DE PAGAR membresia y matricula (si es diferente)

api.post('/pagar-membresia', diegoController.pagarMembresia);
api.post('/pagar-matricula', diegoController.pagarMatricula);


module.exports = api