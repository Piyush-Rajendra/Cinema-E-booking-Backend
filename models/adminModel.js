
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
  
};