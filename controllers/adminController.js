// adminController.js

const adminModel = require('../models/adminModel');
const bcrypt = require('bcrypt');


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
      res.json({ message: 'Admin login successful' });
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
};
