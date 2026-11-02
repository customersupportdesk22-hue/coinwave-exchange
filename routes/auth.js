const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// 1. Define the Authentication Middleware
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

// 2. Register Route
router.post('/register', async (req, res) => {
    try {
        const { name, country, phone, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, country, phone, email, password: hashedPassword });
        await User.findByIdAndUpdate(req.user.id, { twoFactorSecret: secret.base32, twoFactorEnabled: true });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 3. Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
        
        res.json({ token, user: { name: user.name, email: user.email, country: user.country } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

