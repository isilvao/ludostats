const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Club = require('./Club');
const Equipo = require('./Equipo');
const Estadistica = require('./Estadistica');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
        type: DataTypes.ENUM('gerente', 'entrenador', 'deportista', 'acudiente', 'administrador', 'externo'),
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
        type: DataTypes.INTEGER,
        allowNull: true
    },
    equipo_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }

});

// Relación: un Usuario (acudiente) puede tener varios usuarios dependientes
Usuario.hasMany(Usuario, {
    foreignKey: 'acudiente_id',
    as: 'dependientes'
});

  // Relación: un Usuario depende de un acudiente (que también es Usuario)
Usuario.belongsTo(Usuario, {
    foreignKey: 'acudiente_id',
    as: 'acudiente'
});
// usuario.getAcudiente() o usuario.getDependientes()

Usuario.hasMany(Club, { foreignKey: 'gerente_id' });

Usuario.belongsTo(Equipo, {
    foreignKey: 'equipo_id',
    targetKey: 'id',
    as: 'equipo',
});

Usuario.hasMany(Equipo, {
    foreignKey: 'entrenador_id',
    as: 'equiposEntrenados',
});

Usuario.hasMany(Estadistica, {
    foreignKey: 'usuario_id',
    as: 'estadisticas'
})

module.exports = Usuario;
