const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Club = require('./Club');
const Usuario = require('./Usuario');

const Equipo = sequelize.define('Equipo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    club_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

Equipo.belongsTo(Usuario, {
    foreignKey: 'entrenador_id',
    targetKey: 'id',
    as: 'entrenador',
});
Equipo.hasMany(Usuario, {
    foreignKey: 'equipo_id',
    as: 'integrantes',
});

Equipo.belongsTo(Club, {
    foreignKey: 'club_id',
    targetKey: 'id',
    as: 'club',
});


module.exports = Equipo;