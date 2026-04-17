const mysql = require('mysql2');
require('dotenv').config({ path: './backend/.env' });

async function testConnection() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'todo_app',
    port: 3306, // Standard MySQL port
  };

  console.log('Testing connection with config:', { ...dbConfig, password: '***' });

  const pool = mysql.createPool(dbConfig).promise();

  try {
    const connection = await pool.getConnection();
    console.log('Success! Connected to MySQL.');
    connection.release();
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.log('Hint: Check if MySQL is running and the port is correct.');
    }
    process.exit(1);
  }
}

testConnection();
