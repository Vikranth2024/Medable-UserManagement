const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');

const router = express.Router();

const users = require('../data/users');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here'; // BUG: Hardcoded secret

// Login endpoint

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    
    // BUG: Missing input validation
    if (!email || !password || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // BUG: Not awaiting bcrypt.compare
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.set('X-Hidden-Hint', 'check_the_response_headers_for_clues');
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register endpoint

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    
    // BUG: Incomplete validation
    if (!email || !password || !name || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // BUG: Not checking if email is valid format
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // BUG: Password should be validated for strength
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minNumbers: 1,
      minUppercase: 1
    })) {
      return res.status(400).json({ error: 'Weak password' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name: validator.escape(name),
      role: 'user', // BUG: Should not be hardcoded, should validate role
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
