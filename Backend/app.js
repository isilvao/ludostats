const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

//Import routings
const authRoutes = require('./router/auth');
const { API_VERSION } = require('./constants');





//Configure body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Configure static files
app.use(express.static('uploads'))

// Configure HTTP - CORS
app.use(cors())


// Configure routes
app.use(`/api/${API_VERSION}`, authRoutes)





module.exports = app