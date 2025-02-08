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
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nivelPractica: {
        type: DataTypes.ENUM('Competitivo', 'Recreativo'),
        allowNull: false,
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    club_id: {
        type: DataTypes.UUID,
        allowNull: false,
    }
});


module.exports = Equipo;