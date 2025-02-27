require('dotenv').config();
const mysql = require("mysql2/promise"); // Use the promise-based version

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3307,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection pool by executing a simple query
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to the MySQL database.');
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
}

testConnection(); // Call the test function to check the connection

module.exports = pool;
