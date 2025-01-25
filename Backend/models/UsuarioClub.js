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
});

module.exports = UsuarioClub;