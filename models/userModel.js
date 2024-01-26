// userModel.js

const db = require('../db');

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

const getUserByUsernameOrEmail = (usernameOrEmail) => {
  return new Promise((resolve, reject) => {
    const query =
      'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1';
    db.query(query, [usernameOrEmail, usernameOrEmail], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
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

const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
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
  checkUsernameExists,
  getUserByUsername,
  insertUser,
  getAllUsers
};
