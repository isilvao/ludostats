const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Estadistica = sequelize.define('Estadistica', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    usuario_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    tipoEstadistica_id: {
        type: DataTypes.UUID,
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
