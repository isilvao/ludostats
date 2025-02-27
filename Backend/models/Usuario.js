const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    documento: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue : true,
        allowNull: false
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: true
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    acudiente_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    tipo_suscripcion: {
        type: DataTypes.ENUM('gratis', 'basica', 'premium', 'pro'),
        defaultValue: 'gratis',
    },
    fecha_fin_suscripcion: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ultima_transaccion_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    correo_validado:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull:false,
    }

});

module.exports = Usuario;
