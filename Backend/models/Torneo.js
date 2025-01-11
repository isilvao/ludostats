const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Torneo = sequelize.define('Torneo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    portada: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    club_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fecha_fin: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM('En espera', 'En progreso', 'Finalizado', 'Cancelado'),
        allowNull: false,
    },
});


module.exports = Torneo