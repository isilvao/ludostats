const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { initModels } = require('./models/index')
const { API_VERSION } = require('./constants');

const app = express()

//Import routings
const authRoutes = require('./router/auth');
const userRoutes = require('./router/user');
const clubRoutes = require('./router/club');
const tipoEstadisticaRoutes = require('./router/tipoEstadistica');
const estadisticaRoutes = require('./router/estadistica');


//Configure body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Configure static files
app.use(express.static('uploads'))

// Configure HTTP - CORS
app.use(cors())


// Configure routes
app.use(`/api/${API_VERSION}`, authRoutes)
app.use(`/api/${API_VERSION}`, userRoutes)
app.use(`/api/${API_VERSION}`, clubRoutes)
app.use(`/api/${API_VERSION}`, tipoEstadisticaRoutes)
app.use(`/api/${API_VERSION}`, estadisticaRoutes)


// Initialize models and sync with db
initModels()


module.exports = app