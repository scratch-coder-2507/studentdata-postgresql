require('dotenv').config();

module.exports = {
    PORT: process.env.APP_PORT,
    HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DATABASE: process.env.DB_DATABASE,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD
}