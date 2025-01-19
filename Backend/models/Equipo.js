const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Equipo = sequelize.define('Equipo', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cantidad_deportistas: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    entrenador_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    club_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
});


module.exports = Equipo;