const mysql = require('mysql2');

function connectDatabase() {

    try {
        const db = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE
        });

        db.connect(function (err) {
            if (!err) {
                console.log('Database is connected!');
            } else {
                console.log('Error connecting database!');
            }
        });
    
        return db;
    } catch {
        console.log('Error connecting database!');
        return null
    }
}

module.exports = connectDatabase();