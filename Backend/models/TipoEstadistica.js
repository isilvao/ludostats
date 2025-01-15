const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const TipoEstadistica = sequelize.define('TipoEstadistica', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    club_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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