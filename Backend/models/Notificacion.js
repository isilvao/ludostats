const { DataTypes } = require('sequelize');
const sequelize = require('../db');


const Notificacion = sequelize.define('Notificacion', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    usuario_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    tipo: {
        type: DataTypes.ENUM('membresia', 'matricula', 'otro'),
        allowNull: false,
    },
    mensaje: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    leido: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
});

module.exports = Notificacion;
