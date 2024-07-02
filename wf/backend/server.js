const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  email: String
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
  }]
});

// Shop Schema
const shopSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  color: { type: String, required: true }
});

// Models
const User = mongoose.model('User', userSchema);
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

// User Registration
app.post('/api/register', async (req, res) => {
  const { name, username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, username, password: hashedPassword, email });
  try {
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error registering user', error });
  }
});

// User and Admin Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if the user exists in the regular users collection
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ token });
    } else {
      // If not found in users collection, check in admins collection
      const admin = await Admin.findOne({ username });
      if (admin && await bcrypt.compare(password, admin.password)) {
        const token = jwt.sign({ id: admin._id, username: admin.username, isAdmin: true }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
      } else {
        res.status(400).send({ message: 'Invalid credentials' });
      }
    }
  } catch (error) {
    res.status(500).send({ message: 'Error logging in', error });
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

// Admin Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (!admin) {
    return res.status(400).send('Admin not found');
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(400).send('Invalid credentials');
  }

  const token = jwt.sign({ id: admin._id }, 'your_jwt_secret', { expiresIn: '1h' });
  res.json({ token });
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

  try {
    await product.save();
    res.status(201).send('Product uploaded successfully');
  } catch (error) {
    console.error('Error uploading product:', error);
    res.status(400).send('Error uploading product');
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
