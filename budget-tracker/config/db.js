const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: { 
        rejectUnauthorized: false 
    } // <--- THIS IS THE MAGIC KEY FOR TiDB!
});

db.getConnection((err, connection) => {
    if (err) console.error("DB Pool Error:", err);
    else {
        console.log("DB Pool Connected Securely!");
        connection.release();
    }
});

module.exports = db;