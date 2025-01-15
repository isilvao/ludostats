const Usuario = require('./Usuario');
const Club = require('./Club');
const Equipo = require('./Equipo');
const Estadistica = require('./Estadistica');
const TipoEstadistica = require('./TipoEstadistica');
const Torneo = require('./Torneo');

const sequelize = require('../db');

const initModels = async () => {
  try {
    // Sincroniza los modelos con la base de datos
    await sequelize.sync({ force: false }); // Cambia a true para reiniciar las tablas (solo en desarrollo)
    console.log('Modelos sincronizados.');
  } catch (error) {
    console.error('Error al sincronizar los modelos:', error.message);
  }
};

//Asociaciones:
/**               USUARIO                 */

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

/**               CLUB                 */
// Relación: un Club pertenece a un Usuario (gerente)
// foreignKey = la columna de Club que contiene la FK
// targetKey  = la columna de Usuario a la que apunta (por defecto "id")
Club.belongsTo(Usuario, {
  foreignKey: 'gerente_id',
  targetKey: 'id',
  as: 'gerente', // alias opcional para "gerente" en el código
});

Club.hasMany(Equipo, {
  foreignKey: 'club_id',
  as: 'equipos'
});
// club.getEquipos()

Club.hasMany(Torneo, {
  foreignKey: 'club_id',
  as: 'torneos'
});

Club.hasMany(TipoEstadistica, {
  foreignKey: 'club_id',
  as: 'tiposEstadistica'
});

/**               EQUIPO                 */
Equipo.belongsTo(Usuario, {
  foreignKey: 'entrenador_id',
  targetKey: 'id',
  as: 'entrenador',
});
Equipo.hasMany(Usuario, {
  foreignKey: 'equipo_id',
  as: 'integrantes',
});

Equipo.belongsTo(Club, {
  foreignKey: 'club_id',
  targetKey: 'id',
  as: 'club',
});

/**               ESTADISTICA                 */
Estadistica.belongsTo(TipoEstadistica, {
  foreignKey: 'tipoEstadistica_id',
  targetKey: 'id',
  as: 'tipoEstadistica',
})

Estadistica.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  targetKey: 'id',
  as: 'usuario',
})

/**               TIPO ESTADISTICA                 */
TipoEstadistica.hasMany(Estadistica, {
  foreignKey: 'tipoEstadistica_id',
  as: 'estadisticas'
})
TipoEstadistica.belongsTo(Club, {
  foreignKey: 'club_id',
  targetKey: 'id',
  as: 'club',
})


/**               TORNEO                 */
Torneo.belongsTo(Club, {
  foreignKey: 'club_id',
  targetKey: 'id',
  as: 'club',
})



module.exports = { Usuario, Club, Equipo,Estadistica, TipoEstadistica, Torneo, initModels };
