const express = require('express');
const router = express.Router();
const Query = require('../models/Query');

// POST route to handle form submission
router.post('/submit-query', async (req, res) => {
    const { name, email, phone, message } = req.body;

    try {
        // Check if a query already exists for the given email or phone
        const existingQuery = await Query.findOne({
            $or: [
                { email: email },
                { phone: phone }
            ]
        });

        if (existingQuery) {
            return res.status(400).json({ message: 'Your query is already raised. We are working on it.' });
        }

        // Create a new query
        const newQuery = new Query({
            name,
            email,
            phone,
            message
        });

        await newQuery.save();

        res.status(201).json({ message: 'Query submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
