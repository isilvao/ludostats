const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const UsuarioClub = sequelize.define('UsuarioClub', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    usuario_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    club_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    rol: {
        type: DataTypes.ENUM('gerente', 'entrenador', 'deportista', 'acudiente', 'miembro'),
        allowNull: false,
    },
    activado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    fecha_fin_matricula: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    transaccion_id: {
        type: DataTypes.UUID,
        allowNull: true,
    }

});

module.exports = UsuarioClub;