// authController.js

const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const validator = require('validator');

const signUp = async (req, res) => {
  try {
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

    // Successful login
    res.json({ message: 'Login successful' });
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


// Helper function to validate password
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

module.exports = {
  signUp,
  signIn,
  getUserByUsername,
  getAllUsers
};
