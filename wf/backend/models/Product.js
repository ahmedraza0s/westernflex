// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String }, // Make category not required for updates
  subCategory: { type: String }, // Make subCategory not required for updates
  shortDescription: { type: String, required: true },
  longDescription: { type: String, required: true },
  listingPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  productId: { type: String, required: true },
  colors: [{
    color: { type: String, required: true },
    stock: { type: Number, required: true },
    priority: { type: Number, required: true },
    images: [{ type: String, required: true }],
    numberOfImages: { type: Number }, // Make numberOfImages not required for updates
  }],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
