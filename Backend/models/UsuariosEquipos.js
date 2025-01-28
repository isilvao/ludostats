const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const UsuariosEquipos = sequelize.define('UsuariosEquipos', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    usuario_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    equipo_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    rol: {
        type: DataTypes.SMALLINT,
        allowNull: false,
    },
}, {
    tableName: 'UsuariosEquipos',
    timestamps: false,  // Evita que Sequelize agregue createdAt y updatedAt
});

module.exports = UsuariosEquipos;
