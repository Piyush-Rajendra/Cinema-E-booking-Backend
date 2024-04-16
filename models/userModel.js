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
        zipCode VARCHAR(20) NOT NULL,
        status ENUM('active', 'inactive') NOT NULL DEFAULT 'inactive',
        subscribeToPromotion ENUM('yes', 'no') NOT NULL DEFAULT 'yes',
        verificationToken VARCHAR(255) NULL,
        SuspendStatus ENUM('suspended', 'not_suspended') NOT NULL DEFAULT 'not_suspended'
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

const suspendUser = async (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE users SET SuspendStatus = 'inactive' WHERE id = ?`,
      [id],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const deleteUserById = (userId) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM users WHERE id = ?', userId, (err, result) => {
      if (err) {
        reject(err);
      } else {
        // Check if any rows were affected by the delete operation
        if (result.affectedRows === 0) {
          // If no rows were affected, it means the user with the provided ID doesn't exist
          const error = new Error('User not found');
          error.statusCode = 404;
          reject(error);
        } else {
          // If rows were affected, it means the user was successfully deleted
          resolve('User deleted successfully');
        }
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

const billingAddress = () => {
  return new Promise((resolve, reject) => {
    db.query(`
      CREATE TABLE IF NOT EXISTS billingAddress (
        id INT PRIMARY KEY AUTO_INCREMENT,
        billingAddress VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        zipCode VARCHAR(20) NOT NULL,
        userId INT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id),
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
      'INSERT INTO users (fullName, username, password, profilePhoto, email, street, phoneNumber, city, state, zipCode, subscribeToPromotion, verificationToken) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(
      insertUserQuery,
      [
        userData.fullName,
        userData.username,
        userData.hashedPassword,
        userData.profilePhoto,
        userData.email,
        userData.street,
        userData.phoneNumber, 
        userData.city,
        userData.state,
        userData.zipCode,
        userData.subscribeToPromotion,
        userData.verificationToken, 
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

const getUserById = (userId, callback) => {


  db.query(`SELECT * FROM users WHERE id = ?`, [userId], (err, result) => {
    if (err) {
      callback(err, null);
      console.log(user)
      return;
    }

    if (result.length === 0) {
      callback('User not found222211', null);
      return;
    }

    callback(null, result[0]);
  });
};


const getUserByID = async (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

  const DeletepaymentInfoId = async(id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM payment_info WHERE id = ?', [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }


const addPayment = (userId, cardType, cardNumberHash, cardPINHash, expirationDate,) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO payment_info (cardType, cardNumberHash, cardPINHash, expirationDate, userId) VALUES (?, ?, ?, ?)', [cardType, cardNumberHash, cardPINHash, expirationDate], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const addbillingAddress = (userId, billingAddress, city, state, zipCode) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO billingaddress ( billingAddress, city, state, zipCode, userId) VALUES (?, ?, ?, ?, ?)', [billingAddress, city, state, zipCode,userId], (err, result) => {
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

const checkEmailExists = async (email) => {
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
    
    return results.length > 0;
  } catch (error) {
    throw error;
  }
};


const updateUser = (userID, userData) => {
  return new Promise((resolve, reject) => {
      const updateUserQuery =
          'UPDATE users SET fullName = ?, username = ?, profilePhoto = ?, street = ?, city = ?, state = ?, zipCode = ?, registerForPromotion = ?, phoneNumber = ? WHERE id = ?';

      db.query(
          updateUserQuery,
          [
              userData.fullName,
              userData.username,
              userData.profilePhoto,
              userData.street,
              userData.city,
              userData.state,
              userData.zipCode,
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
    // Check if email exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        if (rows.length === 0) {
          // Email doesn't exist, reject with an error message
          reject(new Error('Email not found'));
        } else {
          // Email exists, proceed to update password
          db.query('UPDATE users SET password = ? WHERE email = ?', [password, email], (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
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

const getPaymentByID = async (ID) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM payment_info WHERE id = ?', [ID], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS promotions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      promoCode VARCHAR(255) NOT NULL,
      description TEXT,
      percentoffPromo BOOLEAN,
      valueoffPromo BOOLEAN,
      percentoff FLOAT DEFAULT 0,
      valueoff FLOAT DEFAULT 0
    )
  `;
  
  db.query(createTableQuery, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Table created or already exists');
  });

  const createPromotion = ({ name, promoCode, description, percentoffPromo, valueoffPromo, percentoff, valueoff }, callback) => {
    const insertQuery = `
      INSERT INTO promotions (name, promoCode, description, percentoffPromo, valueoffPromo, percentoff, valueoff) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(insertQuery, [name, promoCode, description, percentoffPromo, valueoffPromo, percentoff, valueoff], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result.insertId);
    });
  };
  
  const deletePromotionById = (promotionId, callback) => {
    const deleteQuery = `
      DELETE FROM promotions 
      WHERE id = ?
    `;
    db.query(deleteQuery, [promotionId], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result.affectedRows);
    });
  };
  
  const updatePromotionById = (promotionId, { name, promoCode, description, percentoffPromo, valueoffPromo, percentoff, valueoff }, callback) => {
    const updateQuery = `
      UPDATE promotions 
      SET name = ?, promoCode = ?, description = ?, percentoffPromo = ?, valueoffPromo = ?, percentoff = ?, valueoff = ?
      WHERE id = ?
    `;
    db.query(updateQuery, [name, promoCode, description, percentoffPromo, valueoffPromo, percentoff, valueoff, promotionId], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result.affectedRows);
    });
  };
  
  const getAllPromotions = (callback) => {
    const selectQuery = `
      SELECT * FROM promotions
    `;
    db.query(selectQuery, (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  };
  
  const getPromotionByPromoCode = (promoCode, callback) => {
    const selectQuery = `
      SELECT * FROM promotions 
      WHERE promoCode = ?
    `;
    db.query(selectQuery, [promoCode], (err, result) => {
      if (err) {
        return callback(err);
      }
      if (result.length === 0) {
        return callback(null, null);
      }
      callback(null, result[0]);
    });
  };

  const createBillingAddress = (billingAddressData) => {
    return new Promise((resolve, reject) => {
      const { billingAddress, city, state, zipCode, userId } = billingAddressData;
      db.query('INSERT INTO billingAddress (billingAddress, city, state, zipCode, userId) VALUES (?, ?, ?, ?, ?)', 
                [billingAddress, city, state, zipCode, userId], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.insertId);
        }
      });
    });
  };
  
  const updateBillingAddress = (billingAddressId, newData) => {
    return new Promise((resolve, reject) => {
      const { billingAddress, city, state, zipCode, userId } = newData;
      db.query('UPDATE billingAddress SET billingAddress = ?, city = ?, state = ?, zipCode = ? WHERE id = ?', 
                 [billingAddress, city, state, zipCode, billingAddressId], (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  };
  
  const deleteBillingAddress = (billingAddressId) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM billingAddress WHERE id = ?', billingAddressId, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  };
  
  const getBillingAddressByUserId = (userId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM billingAddress WHERE userId = ?', userId, (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
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
  deleteUserById,
  addPayment,
  updatePayment,
  updateUser,
  updateUserStatus,
  findUserByVerificationToken,
  createTables,
  updatePassword,
  getPaymentByUserID,
  DeletepaymentInfoId,
  getPaymentByID,
  checkEmailExists,
  addbillingAddress,
  billingAddress,
  createPromotion,
  deletePromotionById,
  updatePromotionById,
  getAllPromotions,
  getPromotionByPromoCode,
  createBillingAddress,
  updateBillingAddress,
  deleteBillingAddress,
  getBillingAddressByUserId,
  suspendUser,
  getUserByID
};
