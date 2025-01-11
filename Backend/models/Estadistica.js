const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Estadistica = sequelize.define('Estadistica', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tipoEstadistica_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    valor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

module.exports = Estadistica;
