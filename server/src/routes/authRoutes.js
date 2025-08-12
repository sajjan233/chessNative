import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../features/user/user.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    return res.status(201).json({ message: 'User created', userId: user._id });
  } catch (err) {
    return res.status(400).json({ error: 'Registration failed', detail: err.message });
  }
});

// ✅ Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const user = await User.findOne({ email }).populate('role');
    console.log("user",user);
    
    if (!user || !user?.role?.slug || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return res.json({ message: 'Login successful', token, payload });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
