const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')


const app = express()


//Import routings

//Configure body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Configure static files
app.use(express.static('uploads'))

// Configure HTTP - CORS
app.use(cors())


// Configure routes


module.exports = app