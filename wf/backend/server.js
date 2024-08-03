const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const queries = require('./routes/queries');


const User = require('./models/User'); //importing model of user

const app = express();
const port = process.env.PORT || 5000;
const secretKey = 'your_secret_key'; // Use a secure key in production

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/westernflexdatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


// User Registration
app.post('/api/register', async (req, res) => {
  const { fname, lname, username, password, email, phno } = req.body;

  try {
    // Check if email or phone number already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phno }] });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).send({ message: 'Email is already registered', field: 'email' });
      }
      if (existingUser.phno === phno) {
        return res.status(400).send({ message: 'Phone number is already registered', field: 'phno' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fname, lname, username, password: hashedPassword, email, phno });

    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error registering user', error });
  }
});

// User Login
app.post('/api/user-login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ token });
    } else {
      res.status(400).send({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error logging in', error });
  }
});


// Admin Schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  subCategory: { type: String },
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
    numberOfImages: { type: Number }
  }],

  tags: [{ type: String }],
  metaTitle: { type: String },
  metaDescription: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

// Shop Schema
const shopSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  color: { type: String, required: true }
});

// Models
const Admin = mongoose.model('Admin', adminSchema);
const Product = mongoose.model('Product', productSchema);
const Shop = mongoose.model('Shop', shopSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

//admin
// Admin Login
app.post('/api/admin-login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (admin && await bcrypt.compare(password, admin.password)) {
      const token = jwt.sign({ id: admin._id, username: admin.username, isAdmin: true }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ token });
    } else {
      res.status(400).send({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error logging in', error });
  }
});

// Admin Registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = new Admin({ username, password: hashedPassword });

  try {
    await admin.save();
    res.status(201).send('Admin registered');
  } catch (error) {
    res.status(400).send('Error registering admin');
  }
});

//admin end here 

// Protected Admin Route Example
app.get('/api/admin', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token.split(' ')[1], secretKey);
    if (!decoded.isAdmin) {
      return res.status(403).send({ message: 'Not authorized' });
    }
    res.status(200).json(decoded);
  } catch (error) {
    res.status(401).send({ message: 'Failed to authenticate token' });
  }
});



// Get User Info
app.get('/api/user', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token.split(' ')[1], secretKey);
    res.status(200).json(decoded);
  } catch (error) {
    res.status(401).send({ message: 'Failed to authenticate token' });
  }
});




// Save shop details route
app.post('/save-shop', async (req, res) => {
  const { productId, color } = req.body;

  const shopDetail = new Shop({ productId, color });

  try {
    await shopDetail.save();
    res.status(201).send('Shop details saved');
  } catch (error) {
    console.error('Error saving shop details:', error);
    res.status(400).send('Error saving shop details');
  }
});

// Fetch shop details route
app.get('/shop-details', async (req, res) => {
  try {
    const shopDetails = await Shop.find();
    res.json(shopDetails);
  } catch (error) {
    console.error('Error fetching shop details:', error);
    res.status(500).send('Server error');
  }
});

// Delete shop details route
app.delete('/shop-details/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Shop.findByIdAndDelete(id);
    res.status(200).send('Shop details deleted');
  } catch (error) {
    console.error('Error deleting shop details:', error);
    res.status(400).send('Error deleting shop details');
  }
});

// Add image to product route
app.post('/add-image-to-product', upload.single('image'), async (req, res) => {
  const { productId, color } = req.body;
  const imagePath = req.file.path;

  try {
    let product = await Product.findOne({ productId });

    if (!product) {
      // Product not found, remove the uploaded image file
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error removing image:', err);
        }
      });
      return res.status(400).send('Product ID does not exist');
    }

    const existingColor = product.colors.find(c => c.color === color);
    if (!existingColor) {
      // Color not found, remove the uploaded image file
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error removing image:', err);
        }
      });
      return res.status(400).send('Color does not exist for the specified product ID');
    }

    // Color exists, add the image
    existingColor.images.push(imagePath);

    await product.save();
    res.status(201).send('Image added to product');
  } catch (error) {
    console.error('Error adding image to product:', error);
    res.status(400).send('Error adding image to product');
  }
});

// Product upload route
app.post('/upload-product', upload.any(), async (req, res) => {
  const { name, category, subCategory, shortDescription, longDescription, listingPrice, sellingPrice, productId, colors } = req.body;
  const parsedColors = JSON.parse(colors);

  const productColors = parsedColors.map((color, colorIndex) => ({
    color: color.color,
    stock: color.stock,
    priority: color.priority,
    images: req.files.filter(file => file.fieldname.startsWith(`images_${colorIndex}`)).map(file => file.path),
    numberOfImages: color.numberOfImages,
  }));

  try {
    // Check if a product with the same productId already exists
    const existingProduct = await Product.findOne({ productId });
    if (existingProduct) {
      return res.status(400).send('Product ID already exists');
    }

    const product = new Product({
      name,
      category,
      subCategory,
      shortDescription,
      longDescription,
      listingPrice,
      sellingPrice,
      productId,
      colors: productColors,
    });

    await product.save();
    res.status(201).send('Product uploaded successfully');
  } catch (error) {
    console.error('Error uploading product:', error);
    res.status(500).send('Error uploading product');
  }
});


// Fetch products route
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Server error');
  }
});

// DELETE Product route
app.delete('/products/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    // Delete images from the file system
    product.colors.forEach(color => {
      color.images.forEach(imagePath => {
        const filePath = path.join(__dirname, imagePath);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Failed to delete image: ${filePath}`, err);
          } else {
            console.log(`Successfully deleted image: ${filePath}`);
          }
        });
      });
    });

    // Delete the product from the database
    await Product.findByIdAndDelete(productId);

    res.status(200).send('Product and associated images deleted');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Error deleting product');
  }
});


//for shop by loading using priority
// Endpoint to fetch products with priority 1, 2, and 3 0
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find({
      'colors.priority': { $in: [1, 2, 3, 0] }
    });

    // Filter colors to include only those with priority 1, 2, or 3 0
    const filteredProducts = products.map(product => {
      const filteredColors = product.colors.filter(color => [1, 2, 3, 0].includes(color.priority));
      return { ...product._doc, colors: filteredColors };
    });

    res.json(filteredProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Server error');
  }
});

// Serve static files from the "upload" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Endpoint to fetch products by productId
app.get('/api/products/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const products = await Product.find({ productId }).exec();

    if (!products || products.length === 0) {
      return res.status(404).json({ error: 'No products found for the given ID' });
    }

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch products route (existing route, consider renaming to differentiate)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Server error');
  }
});


//this code is for update product jsx page 
// Route to get product by ID
app.get('/api/product/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    if (product) {
      res.json(product);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to update product by ID
app.put('/api/product/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { productId: req.params.id },
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to update color by product ID and color index
app.put('/api/product/:id/color/:index', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    if (product) {
      product.colors[req.params.index] = req.body;
      await product.save();
      res.json(product);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
// Route to add new color to product
app.post('/api/product/:id/color', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    if (product) {
      product.colors.push(req.body);
      await product.save();
      res.json(product);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

//update producte jsx page code ends here 

//auth code and order code 
// Authentication Middleware with Debugging
const authenticateUser = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    console.log('Received token:', token); // Debugging line

    // Remove "Bearer " prefix if present
    const actualToken = token.startsWith('Bearer ') ? token.slice(7, token.length).trim() : token;

    console.log('Actual token:', actualToken); // Debugging line
    const decoded = jwt.verify(actualToken, secretKey);
    console.log('Decoded token:', decoded); // Debugging line
    const user = await User.findOne({ username: decoded.username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};



// Route to place an order
app.post('/api/orders', authenticateUser, async (req, res) => {
  const { address, items, totalAmount, orderStatus } = req.body;
  const user = req.user;

  try {
    const order = {
      orderId: uuidv4(),
      orderStatus,
      address: {
        addressline1: address.addressLine1,
        addressline2: address.addressLine2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country, // Add country if required
      },
      items: items.map(item => ({
        productId: item.productId,
        productName: item.title,
        quantity: item.quantity,
        price: item.totalPrice,
        color: item.color, // Include color information
      })),
      orderDate: new Date(),
    };

    user.orders.push(order);
    await user.save();

    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

//order code ends here 

//route to fetch user data from backend

// Route to get authenticated user data
app.get('/api/user/me', authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to update user by username
app.put('/api/user/update/:username', authenticateUser, async (req, res) => {
  try {
    const { username } = req.params;
    const updatedUser = await User.findOneAndUpdate({ username }, req.body, { new: true, runValidators: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(400).json({ error: error.message });
  }
});


// Get all orders for a user
app.get('/api/orders', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace 'your_jwt_secret' with your JWT secret
    const user = await User.findById(decoded.userId).select('orders');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ orders: user.orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//to add review
// Route to handle review submission
app.post('/api/review', authenticateUser, upload.single('image'), async (req, res) => {
  try {
    const { orderId, productId, rating, comment ,color} = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Store relative path

    const user = await User.findOne({ username: req.user.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const order = user.orders.find(order => order.orderId === orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const review = {
      reviewId: new mongoose.Types.ObjectId().toString(),
      productId,
      color,
      rating: parseInt(rating),
      comment,
      reviewDate: new Date(),
      imageUrl
    };

    user.reviews.push(review);
    await user.save();

    res.status(200).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});



// Fetch Product Images by Product ID and Color
app.get('/api/product/:productId/:color', async (req, res) => {
  const { productId, color } = req.params;

  try {
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const colorData = product.colors.find(c => c.color === color);
    if (!colorData) {
      return res.status(404).json({ message: 'Color not found for this product' });
    }

    res.status(200).json(colorData.images);
  } catch (error) {
    console.error('Error fetching product images:', error);
    res.status(500).json({ message: 'Error fetching product images' });
  }
});


//delete review 
// Route to delete a review
app.delete('/api/reviews/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Find the user with the review
    const user = await User.findOne({ 'reviews.reviewId': reviewId });
    if (!user) {
      return res.status(404).send({ error: 'Review not found' });
    }

    // Get the review
    const review = user.reviews.find(r => r.reviewId === reviewId);

    // If there is an image URL, delete the image from the server
    if (review.imageUrl) {
      const imagePath = path.join(__dirname, 'uploads', path.basename(review.imageUrl)); // Ensure only the filename is used
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
          return res.status(500).send({ error: 'Failed to delete image' });
        }
      });
    }

    // Remove the review from the user's reviews array
    const result = await User.updateOne(
      { 'reviews.reviewId': reviewId },
      { $pull: { reviews: { reviewId: reviewId } } }
    );

    if (result.nModified === 0) {
      return res.status(404).send({ error: 'Review not found' });
    }

    res.send({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Server error' });
  }
});

// Cancel an order
app.post('/api/order/cancel/:orderId', authenticateUser, async (req, res) => {
  try {
    const { orderId } = req.params;
    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const order = user.orders.find(order => order.orderId === orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.orderStatus.toLowerCase() !== 'pending') {
      return res.status(400).json({ error: 'Only pending orders can be canceled' });
    }

    order.orderStatus = 'canceled';
    await user.save();

    res.status(200).json({ message: 'Order canceled successfully', order });
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Return an order
app.post('/api/order/return/:orderId', authenticateUser, async (req, res) => {
  try {
    const { orderId } = req.params;
    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the order in user's orders
    const order = user.orders.find(order => order.orderId === orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the order is delivered
    if (order.orderStatus.toLowerCase() !== 'delivered') {
      return res.status(400).json({ error: 'Only delivered orders can be returned' });
    }

    // Calculate days since delivery
    const deliveredDate = new Date(order.orderStatusDate); // Ensure `orderStatusDate` is the correct field
    const today = new Date();
    const timeDiff = today - deliveredDate;
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    if (daysDiff > 5) {
      return res.status(400).json({ error: 'Return period has expired. You can only return orders within 5 days of delivery.' });
    }

    // Update order status to 'returned'
    order.orderStatus = 'returned';
    await user.save();

    res.status(200).json({ message: 'Order returned successfully', order });
  } catch (error) {
    console.error('Error processing return request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//return order ends here 



// Middleware for authenticating admins
const authenticateAdmin = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], secretKey);
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    req.user = await User.findOne({ username: decoded.username });
    next();
  } catch (error) {
    console.error('Error authenticating admin:', error);
    res.status(401).json({ error: 'Failed to authenticate token' });
  }
};

// Fetch Order for User
app.get('/api/orders/:orderId', authenticateUser, async (req, res) => {
  const { orderId } = req.params;
  
  try {
    const order = req.user.orders.find(order => order.orderId === orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
});


//update order page 
// Fetch Order for Admin
// Fetch Order for Admin
app.get('/api/admin/orders/:orderId', authenticateAdmin, async (req, res) => {
  const { orderId } = req.params;

  try {
    const user = await User.findOne({ "orders.orderId": orderId });
    if (!user) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = user.orders.find(order => order.orderId === orderId);
    if (order) {
      const { fname, lname, username } = user; // Get user details
      // Get the first address or modify as needed
      const orderAddress = order.address[0] || {}; 

      return res.status(200).json({
        order: {
          ...order._doc,
          user: { fname, lname, username }, // Include user details
          orderAddress // Include the first address
        }
      });
    }

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    console.error('Error fetching order for admin:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
});


// Update Order for Admin
app.put('/api/admin/orders/:orderId', authenticateAdmin, async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus, estimatedDelivery, orderHistory, items } = req.body;

  try {
    const user = await User.findOne({ "orders.orderId": orderId });
    if (!user) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = user.orders.find(order => order.orderId === orderId);
    if (order) {
      // Check if the orderStatus has changed
      if (order.orderStatus !== orderStatus) {
        order.orderStatus = orderStatus;
        order.orderstatusdate = new Date(); // Update orderstatusdate to the current date
      }
      
      order.estimatedDelivery = estimatedDelivery;
      order.items = items;
      order.orderHistory = orderHistory;

      await user.save();
      return res.status(200).json({ message: 'Order updated successfully' });
    }

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    console.error('Error updating order for admin:', error);
    res.status(500).json({ message: 'Error updating order' });
  }
});


// Get all users and their orders (Admin)  manage users also 
app.get('/api/admin/users-orders', authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'fname lname username orders phno addresses');
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users and their orders:', error);
    res.status(500).json({ message: 'Error fetching users and their orders' });
  }
});


// Change Password Route
app.post('/api/change-password', authenticateUser, async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New passwords do not match' });
  }

  try {
    const user = req.user;

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Error changing password' });
  }
});

// Routes query 
app.use('/api', queries);

//load query
app.get('/api/admin/queries', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send('No token provided');
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    if (decoded.role !== 'admin') {
      return res.status(403).send('Access denied');
    }

    // Fetch queries from the database
    const queries = await Query.find(); // Adjust based on your model
    res.json(queries);
  } catch (error) {
    res.status(401).send('Invalid token');
  }
});
//load query ends here 

// Fetch all reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await User.find({}, 'reviews').lean();
    const allReviews = reviews.flatMap(user => user.reviews);
    res.status(200).json(allReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).send('Server error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});