const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const EventoDependencia = sequelize.define('EventoDependencia', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    evento_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    club_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    equipo_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
});


module.exports = EventoDependencia;