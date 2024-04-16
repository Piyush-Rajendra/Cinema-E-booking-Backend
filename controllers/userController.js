const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const validator = require('validator');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const crypto = require('crypto'); 
const db = require('../db');

const signUp = async (req, res) => {
  try {
    await userModel.createUsersTable();
    const {
      fullName,
      username,
      password,
      confirmPassword,
      profilePhoto,
      email,
      street,
      city,
      state,
      zipCode,
      subscribeToPromotion,
      phoneNumber
    } = req.body;

    const usernameExists = await userModel.checkUsernameExists(username);
    if (usernameExists) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
      // Check if the email already exists
      const emailExists = await userModel.checkEmailExists(email);
      if (emailExists) {
        return res.status(400).json({ error: 'Email already exists' });
      }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        error:
          'Password should be more than 8 characters and should have at least 1 special symbol and one uppercase letter',
      });
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Insert user data with status 'inactive' and verification token
    await userModel.insertUser({
      fullName,
      username,
      hashedPassword,
      profilePhoto,
      email,
      street,
      city,
      state,
      zipCode,
      status: 'inactive',
      verificationToken,
      subscribeToPromotion: 'yes',
      phoneNumber,
    });

    // Send verification email
    const verificationLink = `http://${req.headers.host}/verify-email/${verificationToken}`;
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'ecinemabooking387@gmail.com',
        pass: process.env.password,
      },
    });

    const mailOptions = {
      from: '"Booking System" <ecinemabooking387@gmail.com>',
      to: email,
      subject: 'Registration Successful',
      html: `Congratulations! You have successfully registered for our Website. <br>Click <a href="${verificationLink}"><button style="background-color:green;color:white;padding:10px;border:none;cursor:pointer;"> <br> Click to Verify</button></a> to verify your email.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const isValidPhoneNumber = (phoneNumber) => {
  
  const phoneNumberRegex = /^\+?1?\d{10,15}$/;
  return phoneNumberRegex.test(phoneNumber);
};


// Verification route
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user by verification token
    const user = await userModel.findUserByVerificationToken(token);

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Update user's status to 'active'
    await userModel.updateUserStatus(user.id, 'active');

    // Send success response to the frontend
    res.status(200).json({ message: 'Email verification successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userModel.deleteUserById(id);
    res.status(200).json({ message: result });
  } catch (error) {
    next(error);
  }
};

const suspendUserController = async (req, res) => {
  const { id } = req.params;

  try {
    await userModel.suspendUser(id);
    res.status(200).json({ message: 'Suspension status toggled successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to toggle suspension status.' });
  }
};




const signIn = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const user = await userModel.getUserByUsername(usernameOrEmail);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    if (user.SuspendStatus === 'suspended') {
      return res.status(403).json({ error: 'Your account has been suspended. Please contact the administrator.' });
    }
    
    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });
    res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username } });
    console.log(token);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await userModel.getUserByUsername(username);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userData } = user;

    res.json(userData);
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const getUserById = async (req, res) => {
  try {
    const userID = req.params.id;
    const userInfo = await userModel.getUserByID(userID);
    res.status(200).json({ userInfo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserByEmailController = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await userModel.getUserByEmail(email);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    const sanitizedUsers = users.map(({ password, ...userData }) => userData);

    res.json(sanitizedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const logout = (req, res) => {
  res.json({ message: 'Logout successful' });
}

const PaymentController = async (req, res) => {
  try {
    const { cardType, cardNumber, cardPIN, expirationDate } = req.body;
    const userId = req.params.userId;

    // Check for missing required fields
    if (!cardType || !cardNumber || !cardPIN || !expirationDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate card number length
    if (cardNumber.length !== 16 || !isNumeric(cardNumber)) {
      return res.status(400).json({ error: 'Invalid credit card number' });
    }

    // Validate PIN length
    if (cardPIN.length !== 3 || !isNumeric(cardPIN)) {
      return res.status(400).json({ error: 'Invalid PIN' });
    }

    // Validate expiration date
    const currentDate = new Date();
    const inputExpirationDate = new Date(expirationDate);
    if (inputExpirationDate <= currentDate) {
      return res.status(400).json({ error: 'Expiration date must be in the future' });
    }

    // Hash card number and PIN
    const cardNumberHash = await bcrypt.hash(cardNumber, 10);
    const cardPINHash = await bcrypt.hash(cardPIN, 10);

    // Add payment information
    await userModel.addPayment(userId, cardType, cardNumberHash, cardPINHash, expirationDate);

    res.status(201).json({ message: 'Payment information created successfully' });
  } catch (error) {
    console.error('Error creating payment information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to check if a string is numeric
const isNumeric = (str) => {
  return /^\d+$/.test(str);
};

  
  const PaymentController2 = async (req, res) => {
    try {
      const {  billingAddress, city, state, zipCode } = req.body;
      const userId = req.params.userId;
      if (!billingAddress || !city || !state || !zipCode)
      {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      await userModel.addbillingAddress(userId, billingAddress, city, state, zipCode);
      res.status(201).json({ message: 'Payment information created successfully' });
    } catch (error) {
      console.error('Error creating payment information:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };



  
  const updatePaymentInfo = async (req, res) => {
    const { userId } = req.params;
    const { cardType, cardNumberHash, cardPINHash, expirationDate, billingAddress, city, state, zipCode } = req.body;
    
    try {
      const result = await userModel.updatePayment(userId, cardType, cardNumberHash, cardPINHash, expirationDate, billingAddress, city, state, zipCode);
      res.status(200).json({ message: 'Payment information updated successfully', data: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const deletePaymentInfoById = async (req, res) => {
    try {
      const paymentInfoId = req.params.id;
      await userModel.DeletepaymentInfoId(paymentInfoId);
      res.status(200).json({ success: true, message: 'Payment information deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  const updateUserDetails = async (req, res) => {
    const { userID } = req.params;
    const userData = req.body;
    try {
        const user = await userModel.getUserByIDs(userID);
        const email = user.email;
        if (!email) {
          return res.status(400).json({ error: 'User email is missing or invalid.' });
      }
        delete userData.email;
        if (userData.hashedPassword) {
            userData.hashedPassword = await bcrypt.hash(userData.hashedPassword, 10);
        }
        // Remove this line: delete userData.hashedPassword;
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'ecinemabooking387@gmail.com',
                pass: process.env.password 
            }
        });
        const mailOptions = {
            from: '"Booking System" <ecinemabooking387@gmail.com>',
            to: email, 
            subject: 'Profile Updated Successfully',
            text: 'Your profile has been updated successfully.', 
        };
        await transporter.sendMail(mailOptions);
        const result = await userModel.updateUser(userID, userData);
        res.status(200).json({ message: 'User information updated successfully', data: result });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An error occurred while updating user information.' });
    }
};

const  updateUserDetailsnoEmail= async (req, res) => {
  const { userID } = req.params;
  const userData = req.body;
  try {
      const user = await userModel.getUserByIDs(userID);
      if (userData.hashedPassword) {
          userData.hashedPassword = await bcrypt.hash(userData.hashedPassword, 10);
      }

      const result = await userModel.updateUser(userID, userData);
      res.status(200).json({ message: 'User information updated successfully', data: result });
  } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'An error occurred while updating user information.' });
  }
};


   const requestReset =  async(req, res) => {
      try {
          const { email } = req.body;

          const user = await userModel.getUserByEmail(email);
          if (!user) {
              return res.status(404).json({ error: 'User not found' });
          }

          const token = crypto.randomBytes(20).toString('hex');

          const transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'ecinemabooking387@gmail.com',
                pass: process.env.password 
            }
          });
          const mailOptions = {
              from: '"Password Reset System" <noreply@example.com>',
              to: email,
              subject: 'Password Reset',
              html: `<p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
                     <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                     <p><a href="http://localhost:3001/reset/${token}">Reset Password</a></p>
                     <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
          };
          console.log(token)
          await transporter.sendMail(mailOptions);

          return res.status(200).json({ message: 'Password reset email sent' });
      } catch (error) {
          console.error('Error:', error);
          return res.status(500).json({ error: 'Internal server error' });
      }
    }
  
    
    const updatePassword = async (req, res) => {
      const { email, newPassword } = req.body;
    
      try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
    
        await userModel.updatePassword(email, hashedPassword);
    
        res.status(200).json({ message: 'Password updated successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };

    const getPaymentInfoByUser = async (req, res) => {
      try {
        const userID = req.params.id;
        const paymentInfo = await userModel.getPaymentByUserID(userID);
        res.status(200).json({ paymentInfo });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    };

    const getPaymentInfoById = async (req, res) => {
      try {
        const userID = req.params.id;
        const paymentInfo = await userModel.getPaymentByUserID(userID);
        res.status(200).json({ paymentInfo });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    };



    const createPromotion = (req, res) => {
      const { name, promoCode, description, percentoffPromo, valueoffPromo, percentoff, valueoff } = req.body;
      userModel.createPromotion({ name, promoCode, description, percentoffPromo, valueoffPromo, percentoff, valueoff }, (err, id) => {
        if (err) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ id });
      });
    };
    
   const deletePromotion = (req, res) => {
      const promotionId = req.params.id;
      userModel.deletePromotionById(promotionId, (err, affectedRows) => {
        if (err) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (affectedRows === 0) {
          return res.status(404).json({ error: 'Promotion not found' });
        }
        res.status(200).json({ message: 'Promotion deleted successfully' });
      });
    };
    
    const updatePromotion = (req, res) => {
      const promotionId = req.params.id;
      const { name, promoCode, description, percentoffPromo, valueoffPromo, percentoff, valueoff } = req.body;
      userModel.updatePromotionById(promotionId, { name, promoCode, description, percentoffPromo, valueoffPromo, percentoff, valueoff }, (err, affectedRows) => {
        if (err) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (affectedRows === 0) {
          return res.status(404).json({ error: 'Promotion not found' });
        }
        res.status(200).json({ message: 'Promotion updated successfully' });
      });
    };
    
    const getAllPromotions = (req, res) => {
      userModel.getAllPromotions((err, promotions) => {
        if (err) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json(promotions);
      });
    };
    
   const getPromotionByPromoCode = (req, res) => {
      const promoCode = req.params.promoCode;
      userModel.getPromotionByPromoCode(promoCode, (err, promotion) => {
        if (err) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!promotion) {
          return res.status(404).json({ error: 'Promotion not found' });
        }
        res.status(200).json(promotion);
      });
    };

    const addBillingAddress = async (req, res, next) => {
      try {
        const { userId } = req.params;
        const { billingAddress, city, state, zipCode } = req.body;
        
        // Call the model function to add the billing address
        const result = await userModel.addbillingAddress(userId, billingAddress, city, state, zipCode);
        
        // Send the response
        res.status(201).json({ message: 'Billing address added successfully', result });
      } catch (error) {
        // Handle errors
        next(error);
      }
    };
    
    const updateBillingAddress = async (req, res, next) => {
      try {
        const { userId } = req.params;
        const { id } = req.body; // Assuming the ID of the billing address is provided in the request body
        const billingAddressData = req.body;
        billingAddressData.userId = userId;
        await userModel.updateBillingAddress(id, billingAddressData);
        res.sendStatus(200);
      } catch (error) {
        next(error);
      }
    };
    
    

const deleteBillingAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userModel.deleteBillingAddress(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const getBillingAddressByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const billingAddresses = await userModel.getBillingAddressByUserId(userId);
    res.json(billingAddresses);
  } catch (error) {
    next(error);
  }
};



module.exports = {
  signUp,
  signIn,
  getUserByUsername,
  getAllUsers,
  logout,
  PaymentController,
  updatePaymentInfo,
  updateUserDetails,
  requestReset,
  verifyEmail,
  getUserByEmailController,
  updatePassword,
  getPaymentInfoByUser,
  deletePaymentInfoById,
  getPaymentInfoById,
  PaymentController2,
  updatePromotion,
  createPromotion,
  deletePromotion,
  getAllPromotions,
  getPromotionByPromoCode,
  addBillingAddress,
  updateBillingAddress,
  deleteBillingAddress,
  getBillingAddressByUserId,
  deleteUserById,
  suspendUserController,
  getUserById,
  updateUserDetailsnoEmail
};
