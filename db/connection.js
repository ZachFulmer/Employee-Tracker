const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: 'Zxcvsdfg123!',
        database: 'employee'
    },
    console.log('Welcome to the Employee Manager database.')
);

module.exports = db;