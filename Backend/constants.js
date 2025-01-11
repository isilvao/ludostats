require('dotenv').config()

module.exports = {
    APP_NAME: process.env.APP_NAME,
    API_VERSION: process.env.API_VERSION,
    IP_SERVER: process.env.IP_SERVER,

    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,

    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
};