const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

const users = require('../data/users');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here'; // BUG: Same hardcoded secret

// MISSING FEATURE: Authentication verification
function verifyToken(authHeader) {
  if (!authHeader) {
    throw new Error('No token provided');
  }
  
  const token = authHeader.split(' ')[1];
  return jwt.verify(token, JWT_SECRET);
}

// Get all users

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 */
router.get('/', async (req, res) => {
  try {
    const decoded = verifyToken(req.headers.authorization);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    res.set({
      'X-Total-Users': users.length.toString(),
      'X-Secret-Endpoint': '/api/users/secret-stats'
    });
    
    res.json({
      users: users.slice(start, end).map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    if (error.message === 'No token provided' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 */
router.get('/:userId', async (req, res) => {
  try {
    verifyToken(req.headers.authorization);

    const { userId } = req.params;
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    if (error.message === 'No token provided' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User updated
 */
router.put('/:userId', async (req, res) => {
  try {
    const decoded = verifyToken(req.headers.authorization);

    const { userId } = req.params;
    const updateData = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    Object.assign(users[userIndex], updateData);

    res.json({
      message: 'User updated successfully',
      user: {
        id: users[userIndex].id,
        email: users[userIndex].email,
        name: users[userIndex].name,
        role: users[userIndex].role,
        createdAt: users[userIndex].createdAt
      }
    });
  } catch (error) {
    if (error.message === 'No token provided' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       403:
 *         description: Admin access required
 */
router.delete('/:userId', async (req, res) => {
  try {
    const decoded = verifyToken(req.headers.authorization);

    const { userId } = req.params;
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (decoded.userId === userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    users.splice(userIndex, 1);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.message === 'No token provided' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
