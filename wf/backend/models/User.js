// models/User.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  addressId: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String },
  isDefault: { type: Boolean, default: false },
});

const orderaddress = new mongoose.Schema({
  addressline1 : { type: String, required: true },
  addressline2: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },

});

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  color: {type: String},
 
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  orderStatus: { type: String, required: true },
  items: [orderItemSchema],
  address: [orderaddress],
});

const paymentMethodSchema = new mongoose.Schema({
  paymentMethodId: { type: String, required: true },
  type: { type: String, required: true },
  provider: { type: String, required: true },
  accountNumber: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  isDefault: { type: Boolean, default: false },
});

const reviewSchema = new mongoose.Schema({
  reviewId: { type: String, required: true },
  productId: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  reviewDate: { type: Date, default: Date.now },
});

const preferenceSchema = new mongoose.Schema({
  newsletter: { type: Boolean, default: false },
  smsAlerts: { type: Boolean, default: false },
  emailNotifications: { type: Boolean, default: true },
});

const userSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phno: { type: String, required: true },
  roles: { type: [String], default: ['user'] },
  status: { type: String, default: 'active' },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  addresses: [addressSchema],
  orders: [orderSchema],
  wishlist: { type: [String], default: [] },
  paymentMethods: [paymentMethodSchema],
  reviews: [reviewSchema],
  preferences: { type: preferenceSchema, default: {} },
});
const User = mongoose.model('User', userSchema);

module.exports = User;
