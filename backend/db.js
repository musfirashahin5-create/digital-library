const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.MYSQLHOST || "localhost",
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "Shahin",
    database: process.env.MYSQLDATABASE || "digital_library",
    port: process.env.MYSQLPORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }

    console.log("MySQL connected successfully");
});

module.exports = db;