const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Galeria = sequelize.define('Galeria', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    imagen_url: { // 📌 Enlace a Cloudinary
        type: DataTypes.STRING,
        allowNull: false,
    },
    club_id: {
        type: DataTypes.UUID,
        allowNull: true, // Puede estar asociado a un club
    },
    equipo_id: {
        type: DataTypes.UUID,
        allowNull: true, // Puede estar asociado a un equipo
    }
}, {
    tableName: 'Galeria',
    timestamps: true, // 📌 Agrega createdAt y updatedAt automáticamente
});

module.exports = Galeria;
