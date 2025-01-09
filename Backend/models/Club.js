const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Usuario = require('./Usuario');
const Equipo = require('./Equipo');

const Club = sequelize.define('Club', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    gerente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    deporte: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: true
    },
});

// Relación: un Club pertenece a un Usuario (gerente)
// foreignKey = la columna de Club que contiene la FK
// targetKey  = la columna de Usuario a la que apunta (por defecto "id")
Club.belongsTo(Usuario, {
    foreignKey: 'gerente_id',
    targetKey: 'id',
    as: 'gerente', // alias opcional para "gerente" en el código
});

module.exports = Club;