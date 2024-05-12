const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DATABASE
}).promise()

connection.connect((err) => {
    if(err) {
        console.log("Error Connecting to MySql database, due to :" + err.stack);
        return;
    }
    console.log("Connected to MySQL database.");
});

module.exports = connection;