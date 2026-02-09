// SECRET ENDPOINT - Part of the assessment puzzle
// This endpoint should be discovered by reading the hints

const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Encoded secret message (Base64)
const SECRET_MESSAGE = 'Q29uZ3JhdHVsYXRpb25zISBZb3UgZm91bmQgdGhlIHNlY3JldCBlbmRwb2ludC4gVGhlIGZpbmFsIGNsdWUgaXM6IFNIQ19IZWFkZXJfUHV6emxlXzIwMjQ=';

// Secret stats endpoint

/**
 * @swagger
 * /api/users/secret-stats:
 *   get:
 *     summary: Secret stats endpoint
 *     description: Can be accessed using secret header, query parameter, or JWT token
 *     tags: [Puzzle]
 *     parameters:
 *       - in: header
 *         name: x-secret-challenge
 *         schema:
 *           type: string
 *         description: Secret header access method
 *       - in: query
 *         name: secret
 *         schema:
 *           type: string
 *         description: Query param access method
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Secret stats revealed
 *       403:
 *         description: Access denied
 */
router.get('/', async (req, res) => {
  try {
    // Check for secret header (set by server middleware)
    const secretHeader = req.get('x-secret-challenge');
    const querySecret = req.query.secret;
    const authHeader = req.get('authorization');

    let isAuthenticated = false;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET);
        isAuthenticated = true;
      } catch (e) {}
    }
    
    // PUZZLE: Multiple ways to access this endpoint
    if (
      secretHeader !== 'find_me_if_you_can_2024' &&
      querySecret !== 'admin_override' &&
      !isAuthenticated
    ) {
      return res.status(403).json({ 
        error: 'Access denied',
        hint: 'Check the network headers or try a query parameter'
      });
    }

    // BUG: This endpoint has no authentication despite showing sensitive stats
    const stats = {
      totalUsers: 2,
      adminUsers: 1,
      regularUsers: 1,
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime()
      },
      secretMessage: Buffer.from(SECRET_MESSAGE, 'base64').toString('utf-8'),
      timestamp: new Date().toISOString()
    };

    res.set({
      'X-Puzzle-Complete': 'true',
      'X-Next-Challenge': 'Find all the bugs in the authentication system',
      'Cache-Control': 'no-cache'
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
