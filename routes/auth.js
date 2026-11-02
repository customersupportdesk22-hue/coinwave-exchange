const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
    try {
        const { name, country, phone, email, password } = req.body;
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) return res.status(400).json({ message: "Email exists" });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({ name, country, phone, email: email.toLowerCase(), password: hashedPassword });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ token, user: { name, email, country } });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ token, user: { name: user.name, email: user.email, country: user.country } });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});
module.exports = router;

// ==========================================
// 2FA SETUP ROUTES
// ==========================================
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// 1. Generate 2FA Secret and QR Code
router.post('/generate-2fa', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id || req.user._id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Generate a new secret
        const secret = speakeasy.generateSecret({ name: `CoinWave (${user.email})` });

        // Save the secret to the user's profile (but don't enable yet)
        user.twoFactorSecret = secret.base32;
        await user.save();

        // Generate QR code URL
        QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
            if (err) return res.status(500).json({ error: 'Error generating QR code' });
            res.json({ secret: secret.base32, qrCodeUrl: data_url });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 2. Verify Code and Enable 2FA
router.post('/enable-2fa', authMiddleware, async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findById(req.user.id || req.user._id);
        
        if (!user || !user.twoFactorSecret) {
            return res.status(400).json({ error: '2FA setup not initialized' });
        }

        // Verify the 6-digit code from the Authenticator app
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token
        });

        if (verified) {
            user.twoFactorEnabled = true;
            await user.save();
            res.json({ message: '2FA enabled successfully' });
        } else {
            res.status(400).json({ error: 'Invalid code. Please try again.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
