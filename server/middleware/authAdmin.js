const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/admin');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        req.user = user;  
        next();
    } catch (err) {
        res.clearCookie('token');
        return res.redirect('/admin');
    }
};

module.exports = {
    authMiddleware
}