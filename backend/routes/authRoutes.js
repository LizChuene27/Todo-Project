const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');


router.post('/register', async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username, password: bcrypt.hashSync(password, 10) });
  
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/admin/register', async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ role: 'admin', email, username, password: bcrypt.hashSync(password, 10) });
  
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
  
      if (!user || !user.comparePassword(password)) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
  
      const token = jwt.sign({ username: user.username, id: user.id }, 'your-secret-key', {
        expiresIn: '1h', // Token expiration time
      });
  
      res.status(200).json({ access_token: token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = router;