const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

const secretKey = 'your_secret_key'; // Use a secure key in production

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/westernflexdatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  email: String
});

const User = mongoose.model('User', userSchema);

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

app.post('/api/login', async (req, res) => {
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
