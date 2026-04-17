const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
  user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '/#Satya0709',
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'todo_app',
  port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool({
  ...dbConfig
});

module.exports = pool;
