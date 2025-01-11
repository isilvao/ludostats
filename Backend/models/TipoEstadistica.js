const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const TipoEstadistica = sequelize.define('TipoEstadistica', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

module.exports = TipoEstadistica;