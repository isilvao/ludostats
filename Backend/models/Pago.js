const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Pago = sequelize.define('Pago', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    usuario_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    concepto: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    monto: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
    },
})

module.exports = Pago;