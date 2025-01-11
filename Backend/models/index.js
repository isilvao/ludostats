const Usuario = require('./Usuario');
const Club = require('./Club');
const Equipo = require('./Equipo');
const Estadistica = require('./Estadistica');
const TipoEstadistica = require('./TipoEstadistica');

// Aquí puedes sincronizar las tablas automáticamente si lo deseas
const sequelize = require('../db');

const initModels = async () => {
  try {
    // Sincroniza los modelos con la base de datos
    await sequelize.sync({ force: true }); // Cambia a true para reiniciar las tablas (solo en desarrollo)
    console.log('Modelos sincronizados.');
  } catch (error) {
    console.error('Error al sincronizar los modelos:', error.message);
  }
};

module.exports = { Usuario, Club, Equipo,Estadistica, TipoEstadistica, initModels };
