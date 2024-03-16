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
        homeAddress VARCHAR(255),
        city VARCHAR(255)
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
      'INSERT INTO users (fullName, username, password, profilePhoto, email, homeAddress, city) VALUES (?, ?, ?, ?, ?, ?, ?)';

    db.query(
      insertUserQuery,
      [
        userData.fullName,
        userData.username,
        userData.hashedPassword,
        userData.profilePhoto,
        userData.email,
        userData.homeAddress,
        userData.city,
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


// Function to get user by email from the database
const getUserByEmail = async (email) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]); // Assuming there's only one user with the given email
      }
    });
  });
};

const getUserByID = async (userID) => {
  return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE id = ?', [userID], (err, results) => {
          if (err) {
              reject(err);
          } else {
              if (results.length === 0) {
                  reject(new Error('User not found'));
              } else {
                  resolve(results[0]);
              }
          }
      });
  });
};


const checkUserExists = (userId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length > 0);
      }
    });
  });
};

// Function to add payment information to the database
const addPayment = (userId, cardType, cardNumberHash, cardPINHash, expirationDate, billingAddress, city, state, zipCode) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO payment_info (cardType, cardNumberHash, cardPINHash, expirationDate, billingAddress, city, state, zipCode, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [cardType, cardNumberHash, cardPINHash, expirationDate, billingAddress, city, state, zipCode, userId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const updatePayment = (userId, cardType, cardNumberHash, cardPINHash, expirationDate, billingAddress, city, state, zipCode) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE payment_info SET cardType = ?, cardNumberHash = ?, cardPINHash = ?, expirationDate = ?, billingAddress = ?, city = ?, state = ?, zipCode = ? WHERE userId = ?', [cardType, cardNumberHash, cardPINHash, expirationDate, billingAddress, city, state, zipCode, userId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const updateUser = (userID, userData) => {
  return new Promise((resolve, reject) => {
    const updateUserQuery =
      'UPDATE users SET fullName = ?, username = ?, password = ?, profilePhoto = ?, homeAddress = ?, city = ? WHERE id = ?';

    db.query(
      updateUserQuery,
      [
        userData.fullName,
        userData.username,
        userData.hashedPassword,
        userData.profilePhoto,
        userData.homeAddress,
        userData.city,
        userID
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

module.exports = {
  createUsersTable,
  getUserByUsername,
  insertUser,
  getAllUsers,
  checkUsernameExists,
  getUserByEmail,
  checkUserExists,
  addPayment,
  updatePayment,
  updateUser,
  getUserByID
};
