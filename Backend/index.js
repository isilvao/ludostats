const express = require('express');
const { IP_SERVER, API_VERSION } = require('./constants')
const { initModels, Gerente } = require('./models');
const sequelize = require('./db');

const app = require("./app");
const PORT = process.env.PORT || 3977;


sequelize
.authenticate()
.then(() => {
    console.log('Conexión exitosa a la base de datos.')
    app.listen(PORT, () => {
        console.log(`http://${IP_SERVER}:${PORT}/api/${API_VERSION}`);
    });
})
.catch((error) => console.error('Error de conexión a la base de datos:', error.message));


