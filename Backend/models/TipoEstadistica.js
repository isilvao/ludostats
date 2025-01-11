const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Estadistica = require('./Estadistica')

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

TipoEstadistica.hasMany(Estadistica, {
    foreignKey: 'tipoEstadistica_id',
    as: 'estadisticas'
})

module.exports = TipoEstadistica;