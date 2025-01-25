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
    rol: {
        type: DataTypes.ENUM('gerente', 'entrenador', 'deportista', 'acudiente', 'administrador', 'otro'),
        allowNull: false,
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
    genero: {
        type: DataTypes.ENUM('masculino', 'femenino', 'otro'),
        allowNull: true
    },
    acudiente_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    equipo_id: {
        type: DataTypes.UUID,
        allowNull: true
    }
});

module.exports = Usuario;
