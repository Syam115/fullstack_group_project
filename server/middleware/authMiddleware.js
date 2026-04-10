const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
            
            if (decoded.role === 'patient') req.user = await User.findById(decoded.id).select('-password');
            else if (decoded.role === 'doctor') req.user = await Doctor.findById(decoded.id);
            else if (decoded.role === 'admin') req.user = await Admin.findById(decoded.id);
            
            if (!req.user) return res.status(401).json({ message: 'Not authorized, user not found' });
            
            req.user.role = decoded.role;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
