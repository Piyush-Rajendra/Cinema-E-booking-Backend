
const db = require('../db');

const createAdminsTable = () => {
    return new Promise((resolve, reject) => {
      db.query(`
        CREATE TABLE IF NOT EXISTS admins (
          id INT PRIMARY KEY AUTO_INCREMENT,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
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

  const bcrypt = require('bcrypt');

const registerAdmin = (username, password) => {
  return new Promise((resolve, reject) => {
    // Generate a salt to use for hashing
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return reject(err);
      }
      // Hash the password with the generated salt
      bcrypt.hash(password, salt, (err, hashedPassword) => {
        if (err) {
          return reject(err);
        }
        // Insert the hashed password into the database
        db.query('INSERT INTO admins (username, password) VALUES (?, ?)', [username, hashedPassword], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    });
  });
};


  const getAdminByUsername = (username) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM admins WHERE username = ?', [username], (err, results) => {
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
    db.query('SELECT * FROM admins', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  getAllUsers,
  getAdminByUsername,
  registerAdmin,
  createAdminsTable
};