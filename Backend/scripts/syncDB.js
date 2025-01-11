// Ejemplo en tu archivo principal (app.js, server.js o donde inicies la app)
const { Club, Equipo, Estadistica, TipoEstadistica, Torneo, Usuario, initModels} = require('../models/index'); // O tu initModels

(async () => {
  initModels()
})();