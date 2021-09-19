const Pool = require('pg').Pool;
const {HOST, DB_PORT, USER, PASSWORD, DATABASE} = require('./config');

const pool = new Pool({
    host: HOST,
    port: DB_PORT,
    user: USER,
    password: PASSWORD,
    database: DATABASE
});

module.exports = pool;