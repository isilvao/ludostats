const Usuario = require('./Usuario');
const Club = require('./Club');
const Equipo = require('./Equipo');
const Estadistica = require('./Estadistica');
const TipoEstadistica = require('./TipoEstadistica');
const UsuarioClub = require('./UsuarioClub');
const Evento = require('./Evento');
const Pago = require('./Pago');

const sequelize = require('../db');
const Invitacion = require('./invitacion');
const UsuariosEquipos = require('./UsuariosEquipos');


const initModels = async () => {
  try {
    // Sincroniza los modelos con la base de datos
    await sequelize.sync({ force: false }); // Cambia a true para reiniciar las tablas (solo en desarrollo)
    // await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados.');
  } catch (error) {
    console.error('Error al sincronizar los modelos:', error.message);
  }
};

//Asociaciones:
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

// Relación: un Usuario puede pertenecer a varios clubes con diferente rol en cada uno
Usuario.hasMany(UsuarioClub, {
  foreignKey: 'usuario_id',
  as: 'clubes',
  onDelete: 'CASCADE'
})
UsuarioClub.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
})

// Relacion: un Usuario puede pertenecer a varios equipos con diferente rol en cada uno
Usuario.hasMany(UsuariosEquipos, {
  foreignKey: 'usuario_id',
  as: 'equipos',
  onDelete: 'CASCADE'
})
UsuariosEquipos.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
})

// Relacion un Usuario puede tener realizar varios pagos de mensualidad
Usuario.hasMany(Pago, {
  foreignKey: 'usuario_id',
  as: 'pagos'
})
Pago.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
})

// Relación: un Usuario puede tener varias estadísticas
Usuario.hasMany(Estadistica, {
  foreignKey: 'usuario_id',
  as: 'estadisticas',
  onDelete: 'CASCADE'
})
Estadistica.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario',
})

// Relación: una invitación pertenece a un usuario (creador)
Usuario.hasMany(Invitacion, {
  foreignKey: 'creator_id',
  as: 'invitaciones'
})
Invitacion.belongsTo(Usuario, {
  foreignKey: 'creator_id',
  targetKey: 'id',
  as: 'creador'
});

// Relación: una invitación puede tener un usuario extra
Usuario.hasMany(Invitacion, {
  foreignKey: 'extra_id',
  as: 'invitacionesExtra'
});
Invitacion.belongsTo(Usuario, {
  foreignKey: 'extra_id',
  targetKey: 'id',
  as: 'extraUsuario'
});

// Relación: una invitación pertenece a un equipo
Invitacion.belongsTo(Equipo, {
  foreignKey: 'equipo_id',
  targetKey: 'id',
  as: 'equipo'
});
Equipo.hasMany(Invitacion, {
  foreignKey: 'equipo_id',
  as: 'invitaciones'
})

// Relacion: un equipo tiene varios usuarios con diferente rol
Equipo.hasMany(UsuariosEquipos, {
  foreignKey: 'equipo_id',
  as: 'usuariosEquipos',
  onDelete: 'CASCADE'
})
UsuariosEquipos.belongsTo(Equipo, {
  foreignKey: 'equipo_id',
  as: 'equipo'
})

// Relacion: un club tiene varios equipos
Equipo.belongsTo(Club, {
  foreignKey: 'club_id',
  as: 'club'
})
Club.hasMany(Equipo, {
  foreignKey: 'club_id',
  as: 'equipos'
})

// Relacion: un club tiene varios usuarios con diferente rol
Club.hasMany(UsuarioClub, {
  foreignKey: 'club_id',
  as: 'usuarios'
})
UsuarioClub.belongsTo(Club, {
  foreignKey: 'club_id',
  as: 'club'
})

// Relacion: un club tiene varios tipos eventos
Club.hasMany(Evento, {
  foreignKey: 'club_id',
  as: 'eventos'
})
Evento.belongsTo(Club, {
  foreignKey: 'club_id',
  as: 'club'
})

// Relacion: un club tiene varios tipos de estadisticas
Club.hasMany(TipoEstadistica, {
  foreignKey: 'club_id',
  as: 'tiposEstadistica'
})
TipoEstadistica.belongsTo(Club, {
  foreignKey: 'club_id',
  as: 'club'
})

// Relacion: un tipo de estadisticas tiene varias estadisticas
TipoEstadistica.hasMany(Estadistica, {
  foreignKey: 'tipoEstadistica_id',
  as: 'estadisticas',
  onDelete: 'CASCADE'
})
Estadistica.belongsTo(TipoEstadistica, {
  foreignKey: 'tipoEstadistica_id',
  as: 'tipoEstadistica'
})



module.exports = { Usuario, Club, Equipo,Estadistica, TipoEstadistica, UsuarioClub, UsuariosEquipos, Invitacion, Pago, Evento, initModels };
