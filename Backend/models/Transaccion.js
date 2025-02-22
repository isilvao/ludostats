const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Transaccion = sequelize.define('Transaccion', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    usuario_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    destinatario_id: {
        type: DataTypes.UUID,
        allowNull: true, // Puede ser un equipo, club o usuario
    },
    tipo: {
        type: DataTypes.ENUM('suscripcion', 'matricula', 'otro'),
        allowNull: false,
    },
    concepto: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    club_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    equipo_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    metodo_pago: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Transaccion;
