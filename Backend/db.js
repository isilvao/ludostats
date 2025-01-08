const { Sequelize } = require('sequelize');
const { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } = require('./constants');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres', // Indica que usarás PostgreSQL
    port: DB_PORT,
    logging: false, // Desactiva el logging de SQL queries (puedes activarlo si lo necesitas)
});

console.log('Conectando a la base de datos...');


module.exports = sequelize;
