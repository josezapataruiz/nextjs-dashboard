import mysql from 'mysql2/promise';
import { ConnectionOptions } from './definitions';

// Configuración de conexión a MySQL
const dbConfig: ConnectionOptions = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'mysql',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  };

export const createMySQLPool = mysql.createPool(dbConfig);
