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

const orderHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  orderStatus: { type: String, required: true },
  orderstatusdate: { type: Date, default: Date.now },
  items: [orderItemSchema],
  address: [orderaddress],
  orderHistory: [orderHistorySchema],
  estimatedDelivery: { type: Date } // Add estimated delivery date
});

const returnOrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  reason: { type: String, required: true },
  image1: { type: String },
  image2: { type: String },
  image3: { type: String },
  returnDate: { type: Date, default: Date.now },
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
  color: { type: String},
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  reviewDate: { type: Date, default: Date.now },
  imageUrl: { type: String },
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
  returnOrders: [returnOrderSchema],
  wishlist: { type: [String], default: [] },
  paymentMethods: [paymentMethodSchema],
  reviews: [reviewSchema],
  preferences: { type: preferenceSchema, default: {} },
});
const User = mongoose.model('User', userSchema);

module.exports = User;
