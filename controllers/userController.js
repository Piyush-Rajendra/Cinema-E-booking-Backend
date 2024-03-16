const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const validator = require('validator');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config()

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
      homeAddress,
      city,
    } = req.body;

    const usernameExists = await userModel.checkUsernameExists(username);
    if (usernameExists) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        error:
          'Password should be more than 8 characters and should have at least 1 special symbol and one uppercase letter',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    await userModel.insertUser({
      fullName,
      username,
      hashedPassword,
      profilePhoto,
      email,
      homeAddress,
      city
    });
    const transporter = nodemailer.createTransport({
      service:'Gmail',
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
      subject: 'Registration Successful',
      text: 'Congratulations! You have successfully registered for our Website.',
    };
    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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
    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
    console.log(token)
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


const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const token = generateRandomToken();
    await userModel.saveResetToken(email, token);
    sendResetPasswordEmail(email, token);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const generateRandomToken = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(20, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString('hex'));
      }
    });
  });
};


const sendResetPasswordEmail = (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'ecinemabooking387@gmail.com',
      pass: 'ylnnfoodgxwzawsh'
    },
  });

  const mailOptions = {
    from: '"Booking System" <ecinemabooking387@gmail.com>',
    to: email,
    subject: 'Password Reset',
    text: `Click the following link to reset your password: http://example.com/reset-password?token=${token}`,
  };
  console.log(token)
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
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
      const { cardType, cardNumber, cardPIN, expirationDate, billingAddress, city, state, zipCode } = req.body;
      const userId = req.params.userId;
      if (!cardType || !cardNumber || !cardPIN || !expirationDate || !billingAddress || !city || !state || !zipCode)
      {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const cardNumberHash = await bcrypt.hash(cardNumber, 10);
      const cardPINHash = await bcrypt.hash(cardPIN, 10);
      await userModel.addPayment(userId, cardType, cardNumberHash, cardPINHash, expirationDate, billingAddress, city, state, zipCode);
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
      
      const result = await updatePaymentByUserId(userId, cardType, cardNumberHash, cardPINHash, expirationDate, billingAddress, city, state, zipCode);
      res.status(200).json({ message: 'Payment information updated successfully', data: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const updateUserDetails = async (req, res) => {
    const { userID } = req.params;
    const userData = req.body;
    try {
        const user = await userModel.getUserByID(userID);
        const email = user.email;
        delete userData.email;
        if (userData.hashedPassword) {
            userData.hashedPassword = await bcrypt.hash(userData.hashedPassword, 10);
        }
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

module.exports = {
  signUp,
  signIn,
  getUserByUsername,
  getAllUsers,
  forgotPassword,
  logout,
  PaymentController,
  updatePaymentInfo,
  updateUserDetails
};
