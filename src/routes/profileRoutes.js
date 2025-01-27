const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Apply authentication middleware to specific routes instead of using router.use()
// Get profile details
router.get('/:id', authMiddleware, getProfile);

// Update profile
// Use upload.single('profileImage') for handling image uploads
router.put('/:id', authMiddleware, upload.single('profileImage'), updateProfile);

module.exports = router; 