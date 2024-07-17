const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
  const { name, username, password, email, phno } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, username, password: hashedPassword, email,phno });
  try {
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
  }]
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


//for shop by loading using priority
// Endpoint to fetch products with priority 1, 2, and 3
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find({
      'colors.priority': { $in: [1, 2, 3] }
    });

    // Filter colors to include only those with priority 1, 2, or 3
    const filteredProducts = products.map(product => {
      const filteredColors = product.colors.filter(color => [1, 2, 3].includes(color.priority));
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


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
