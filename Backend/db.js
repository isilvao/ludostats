const { Sequelize } = require('sequelize');
const { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } = require('./constants');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres',
    port: DB_PORT,
    logging: false,
});

console.log('Conectando a la base de datos...');


module.exports = sequelize;
