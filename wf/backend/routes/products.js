// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
