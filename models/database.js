const mysql = require('mysql2');

function connectDatabase() {

    try {
        const db = mysql.createConnection({
            host: '127.0.0.1',
            user: 'user',
            password: 'P@ssW0rd',
            database: 'movies'
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