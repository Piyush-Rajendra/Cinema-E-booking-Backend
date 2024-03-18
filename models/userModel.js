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
        street VARCHAR(255),
        city VARCHAR(255),
        state VARCHAR(255),
        zipCode VARCHAR(255),
        status ENUM('active', 'inactive') NOT NULL DEFAULT 'inactive',
        verificationToken VARCHAR(255) NULL
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

// Function to create payment_info table
const createPaymentInfoTable = () => {
  return new Promise((resolve, reject) => {
    db.query(`
      CREATE TABLE IF NOT EXISTS payment_info (
        id INT PRIMARY KEY AUTO_INCREMENT,
        cardType VARCHAR(255) NOT NULL,
        cardNumberHash VARCHAR(255) NOT NULL,
        cardPINHash VARCHAR(255) NOT NULL,
        expirationDate DATE NOT NULL,
        billingAddress VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        zipCode VARCHAR(20) NOT NULL,
        userId INT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
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




// Function to create both tables
const createTables = async () => {
  try {
    await createUsersTable();
    await createPaymentInfoTable();
  } catch (err) {
    throw err;
  }
};



const insertUser = (userData) => {
  return new Promise((resolve, reject) => {
    const insertUserQuery =
      'INSERT INTO users (fullName, username, password, profilePhoto, email, street, phoneNumber, city, state, zipCode verificationToken, registerForPromotion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?)'; // Modify the query to include registerForPromotion

    db.query(
      insertUserQuery,
      [
        userData.fullName,
        userData.username,
        userData.hashedPassword,
        userData.profilePhoto,
        userData.email,
        userData.street,
        userData.city,
        userData.state,
        userData.zipCode,
        userData.verificationToken,
        userData.registerForPromotion // Include registerForPromotion here
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



const getUserByUsername = (identifier) => {
  return new Promise((resolve, reject) => {

    const isEmail = identifier.includes('@');

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


const getUserByEmail = async (email) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
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

const updateUser = (userID, userData) => {
  return new Promise((resolve, reject) => {
    const updateUserQuery =
      'UPDATE users SET fullName = ?, username = ?, password = ?, profilePhoto = ?, homeAddress = ?, city = ?, registerForPromotion = ?, phoneNumber = ? WHERE id = ?';

    db.query(
      updateUserQuery,
      [
        userData.fullName,
        userData.username,
        userData.hashedPassword,
        userData.profilePhoto,
        userData.homeAddress,
        userData.city,
        userData.registerForPromotion,
        userData.phoneNumber,
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


const findUserByVerificationToken = (token) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE verificationToken = ?';
    db.query(query, [token], (err, results) => {
      if (err) {
        console.error('Error finding user by verification token:', err);
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

    

const updateUserStatus = async (userId, status) => {
  try {
    const query = 'UPDATE users SET status = ? WHERE id = ?';
    await db.query(query, [status, userId]);
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

const updatePassword = async (email, password) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE users SET password = ? WHERE email = ?', [email, password], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getPaymentByUserID = async (userID) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM payment_info WHERE userId = ?', [userID], (err, results) => {
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
  checkUsernameExists,
  getUserByEmail,
  checkUserExists,
  addPayment,
  updatePayment,
  getUserByID,
  updateUser,
  updateUserStatus,
  findUserByVerificationToken,
  createTables,
  updatePassword,
  getPaymentByUserID
};
