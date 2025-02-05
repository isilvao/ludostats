const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initModels } = require('./models/index');
const { API_VERSION } = require('./constants');

const app = express();

// Import routings
const authRoutes = require('./router/auth');
const userRoutes = require('./router/user');
const clubRoutes = require('./router/club');
const diegoRoutes = require('./router/teams');
const tipoEstadisticaRoutes = require('./router/tipoEstadistica');
const estadisticaRoutes = require('./router/estadistica');
const equiposRoutes = require('./router/equipos'); // Rutas para Equipos
const usuariosEquiposRoutes = require('./router/usuariosEquipos'); // Rutas para UsuariosEquipos
const eventosRoutes = require('./router/evento'); // Rutas para Eventos

// Configure body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure static files
app.use(express.static('uploads'));

// Configure HTTP - CORS
app.use(cors());

// Configure routes
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, clubRoutes);
app.use(`/api/${API_VERSION}`, tipoEstadisticaRoutes);
app.use(`/api/${API_VERSION}`, estadisticaRoutes);
app.use(`/api/${API_VERSION}`, equiposRoutes); // Agregar rutas de equipos
app.use(`/api/${API_VERSION}`, usuariosEquiposRoutes); // Agregar rutas de usuariosEquipos
app.use(`/api/${API_VERSION}`, eventosRoutes); // Agregar rutas de eventos

app.use(`/api/${API_VERSION}`, diegoRoutes); // Agregar rutas de eventos

// Initialize models and sync with db
initModels();

module.exports = app;
