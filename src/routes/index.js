const express = require('express');
const userRoutes = require('../modules/user/routes/user.routes');
const authRoutes = require('../modules/auth/routes/auth.routes');
const { generatePostmanCollection } = require('../utils/postmanGenerator');
const path = require('path');
const fs = require('fs');
const os = require('os');

const router = express.Router();

/**
 * API Routes
 */
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

/**
 * Generate and download Postman collection
 * @route GET /api-docs/postman
 */
router.get('/api-docs/postman', (req, res) => {
  try {
    // Generate collection to a temporary file
    const tempFile = path.join(os.tmpdir(), 'postman-collection.json');
    generatePostmanCollection(tempFile);
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="postman-collection.json"');
    
    // Stream the file to the response
    const fileStream = fs.createReadStream(tempFile);
    fileStream.pipe(res);
    
    // Clean up temp file after sending
    fileStream.on('end', () => {
      fs.unlinkSync(tempFile);
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate Postman collection', 
      error: error.message 
    });
  }
});

module.exports = router; 