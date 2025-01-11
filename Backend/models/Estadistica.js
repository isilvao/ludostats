const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Usuario = require('./Usuario');
const TipoEstadistica = require('./TipoEstadistica');

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

Estadistica.belongsTo(TipoEstadistica, {
    foreignKey: 'tipoEstadistica_id',
    targetKey: 'id',
    as: 'tipoEstadistica',
})

Estadistica.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    targetKey: 'id',
    as: 'usuario',
})

module.exports = Estadistica;
