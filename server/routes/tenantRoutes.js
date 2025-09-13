const express = require('express');
const router = express.Router();
const { upgradeTenant } = require('../controllers/tenantController');
const { protect, admin } = require('../middleware/authMiddleware');

// Only a protected user who is also an Admin can access this route
router.post('/:slug/upgrade', protect, admin, upgradeTenant);

module.exports = router;