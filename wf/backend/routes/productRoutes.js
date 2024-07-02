// routes/productRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

const router = express.Router();

// Set up Multer storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// Product upload route
router.post('/upload-product', upload.any(), async (req, res) => {
  const { name, category, subCategory, shortDescription, longDescription, listingPrice, sellingPrice, productId, colors } = req.body;
  const parsedColors = JSON.parse(colors);

  const productColors = parsedColors.map((color, colorIndex) => ({
    color: color.color,
    stock: color.stock,
    priority: color.priority,
    images: req.files.filter(file => file.fieldname.startsWith(`images_${colorIndex}`)).map(file => file.path),
    numberOfImages: color.numberOfImages,
  }));

  const product = new Product({
    name,
    category,
    subCategory,
    shortDescription,
    longDescription,
    listingPrice,
    sellingPrice,
    productId,
    colors: productColors
  });

  try {
    await product.save();
    res.status(201).send('Product uploaded');
  } catch (error) {
    console.error('Error uploading product:', error);
    res.status(400).send('Error uploading product');
  }
});

module.exports = router;
