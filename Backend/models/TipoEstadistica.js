const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const TipoEstadistica = sequelize.define('TipoEstadistica', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    club_id: {
        type: DataTypes.UUID,
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