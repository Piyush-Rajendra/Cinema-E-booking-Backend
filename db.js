// db.js

const mysql = require('mysql');
// const { createUsersTable } = require('./models/userModel');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cinema_booking_db',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});


module.exports = db;
