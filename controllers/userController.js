// authController.js

const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const validator = require('validator');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

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
      age,
      homeAddress,
      city,
      paymentInfo,
    } = req.body;

    // Check if username already exists
    const usernameExists = await userModel.checkUsernameExists(username);
    if (usernameExists) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password
    if (!isValidPassword(password)) {
      return res.status(400).json({
        error:
          'Password should be more than 8 characters and should have at least 1 special symbol and one uppercase letter',
      });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user data to MySQL
    await userModel.insertUser({
      fullName,
      username,
      hashedPassword,
      profilePhoto,
      email,
      age,
      homeAddress,
      city,
      paymentInfo,
    });

    // Send email after successful registration
    const transporter = nodemailer.createTransport({
      service:'Gmail',
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
          user: 'ecinemabooking387@gmail.com',
          pass: 'ylnnfoodgxwzawsh'
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

    // Check if username or email exists
    const user = await userModel.getUserByUsername(usernameOrEmail);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

    // Successful login with token
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

    // Exclude sensitive information (like password) before sending the response
    const { password, ...userData } = user;

    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();

    // Exclude sensitive information (like password) before sending the response
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

    // Generate a random token (you can use a package like 'crypto' for this)
    const token = generateRandomToken();

    // Save the token in the database
    await userModel.saveResetToken(email, token);

    // Send the reset password email
    sendResetPasswordEmail(email, token);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Helper function to generate a random token
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

// Function to send reset password email
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


// Helper function to validate password
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const logout = (req, res) => {
  // Perform any logout-related operations (optional)

  // Respond with a success message
  res.json({ message: 'Logout successful' });
};
module.exports = {
  signUp,
  signIn,
  getUserByUsername,
  getAllUsers,
  forgotPassword,
  logout
};
