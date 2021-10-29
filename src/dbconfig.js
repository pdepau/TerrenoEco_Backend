var mysql = require('mysql');

const pool = mysql.createPool({
    host : "127.0.0.1",
    user : "root",
    password : "",
    database : "m1_database"
});

export default pool;