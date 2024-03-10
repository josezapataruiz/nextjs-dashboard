const mysql = require('mysql2/promise');

async function createMySQLConnection() {
  return mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'mysql',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  })
};

module.exports = {
  createMySQLConnection
}