const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Evento = sequelize.define('Evento', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fecha_fin: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    club_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
})


module.exports = Evento;