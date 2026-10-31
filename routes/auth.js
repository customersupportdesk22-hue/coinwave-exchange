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
