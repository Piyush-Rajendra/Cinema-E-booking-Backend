// userModel.js

const db = require('../db');

// Function to create users table if it doesn't exist
const createUsersTable = () => {
  return new Promise((resolve, reject) => {
    db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        fullName VARCHAR(255) NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        profilePhoto TEXT,
        email VARCHAR(255) UNIQUE NOT NULL,
        age DATE,
        homeAddress VARCHAR(255),
        city VARCHAR(255),
        paymentInfo TEXT
      )
    `, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};



const insertUser = (userData) => {
  return new Promise((resolve, reject) => {
    const insertUserQuery =
      'INSERT INTO users (fullName, username, password, profilePhoto, email, age, homeAddress, city, paymentInfo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(
      insertUserQuery,
      [
        userData.fullName,
        userData.username,
        userData.hashedPassword,
        userData.profilePhoto,
        userData.email,
        userData.age,
        userData.homeAddress,
        userData.city,
        userData.paymentInfo,
      ],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

const checkUsernameExists = (username) => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM users WHERE username = ?',
      [username],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.length > 0);
        }
      }
    );
  });
};

const getUserByUsername = (identifier) => {
  return new Promise((resolve, reject) => {
    // Check if the provided identifier is an email or a username
    const isEmail = identifier.includes('@');
    
    // Choose the appropriate query based on the identifier type
    const query = isEmail
      ? 'SELECT * FROM users WHERE email = ?'
      : 'SELECT * FROM users WHERE username = ?';

    db.query(query, [identifier], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  createUsersTable,
  getUserByUsername,
  insertUser,
  getAllUsers,
  checkUsernameExists
};
