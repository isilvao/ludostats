const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Invitacion = sequelize.define('Invitacion', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    equipo_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    rol_invitado: {
        type: DataTypes.SMALLINT,
        allowNull: false,
    },
    usado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    fecha_exp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    creator_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    extra_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    clave: {
        type: DataTypes.STRING(6),
        allowNull: false,
        unique: true,
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
}, {
    tableName: 'Invitaciones',
    timestamps: false,
});

module.exports = Invitacion;
