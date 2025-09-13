const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Auth user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(`Attempting login for email: ${email}`); // <-- ADD THIS

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('DEBUG: User not found in database.'); // <-- ADD THIS
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('DEBUG: User found:', user.email); // <-- ADD THIS

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('DEBUG: Password comparison failed.'); // <-- ADD THIS
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('DEBUG: Password comparison successful. Generating token.'); // <-- ADD THIS

    const payload = { userId: user.id, tenantId: user.tenantId, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ token });
  } catch (err) {
    console.error('SERVER ERROR in login:', err); // <-- ADD THIS
    res.status(500).json({ message: 'Server error' });
  }
};