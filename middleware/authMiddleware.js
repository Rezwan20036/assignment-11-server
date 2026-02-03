const admin = require('../config/firebase-config');
const User = require('../models/User');

exports.verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        // Find existing user in MongoDB by email
        const dbUser = await User.findOne({ email: decodedToken.email });

        if (!dbUser) {
            return res.status(404).json({ message: 'User not found in database' });
        }

        req.user = dbUser; // Attach the full DB user object
        next();
    } catch (error) {
        console.error('Auth Error:', error.message);
        res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
    }
};

exports.verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admin role required' });
    }
};

exports.verifyStaff = (req, res, next) => {
    if (req.user && (req.user.role === 'staff' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Staff role required' });
    }
};
