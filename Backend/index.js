require('./cronjobs'); // 📌 Importa y ejecuta los cron jobs


const { IP_SERVER, API_VERSION } = require('./constants')
const sequelize = require('./db');

const app = require("./app");
const PORT = process.env.PORT || 3977;
const HOST = '0.0.0.0'; // Ensures it listens on all IPs

sequelize
.authenticate()
.then(() => {
    console.log('Conexión exitosa a la base de datos.')
    app.listen(PORT, HOST, () => {
        console.log(`http://${IP_SERVER}:${PORT}/api/${API_VERSION}`);
    });
})
.catch((error) => console.error('Error de conexión a la base de datos:', error.message));


