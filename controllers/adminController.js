// adminController.js

const adminModel = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerAdmin = require('../models/adminModel').registerAdmin;

const createAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Username and password must be strings' });
  }


  try {
    // Call the registerAdmin function from the model
    await registerAdmin(username, password);
   
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const adminSignIn = async (req, res) => {
    try {
      // Ensure the admins table is created
      await adminModel.createAdminsTable();
  
      const { username, password } = req.body;
  
      // Check if admin username exists
      const admin = await adminModel.getAdminByUsername(username);
  
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }
  
      // Check password
      const passwordMatch = await bcrypt.compare(password, admin.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Incorrect password' });
      }
  
      // Successful login
      const token = jwt.sign({ adminId: admin.id }, 'your-secret-key', { expiresIn: '1h' });
      res.json({ message: 'Admin login successful',  token, user: { id: admin.id, username: admin.username } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


const getAllUsers = async (req, res) => {
  try {
    const users = await adminModel.getAllUsers();

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllUsers,
  adminSignIn,
  createAdmin,
};
