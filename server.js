require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Dog = require('./models/Dog'); // Ensure this file exists with your Dog schema

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname)));

// Serve uploaded images folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes for HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'services.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/street-dog-service';
mongoose
  .connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));

// User Schema & Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

// Registration endpoint
app.post('/api/users/register', async (req, res) => {

  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: '❌ All fields are required!' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: '❌ Email already exists!' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: '✅ Registration Successful!' });
  } catch (error) {
    console.error('❌ Registration Error:', error);
    res.status(500).json({ success: false, message: '❌ Server Error', error: error.message });
  }
});


// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: '❌ User not found!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: '❌ Invalid credentials!' });

    res.status(200).json({ success: true, message: '✅ Login Successful!' });
  } catch (error) {
    res.status(500).json({ success: false, message: '❌ Server Error' });
  }
});

// Get all dogs endpoint
app.get('/api/dogs', async (req, res) => {
  try {
    const dogs = await Dog.find();
    res.status(200).json(dogs);
  } catch (error) {
    console.error('❌ Error fetching dogs:', error);
    res.status(500).json({ success: false, message: '❌ Error fetching dogs', error: error.message });
  }
});

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1720000000.jpg
  },
});
const upload = multer({ storage });

// Upload dog photo + data endpoint with auto size assignment
app.post('/api/dogs/upload', upload.single('image'), async (req, res) => {
  try {
    // Get fields from request
    const { name, breed, age: ageStr, gender, location, color, vaccinated, adoptionStatus, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: '❌ No image uploaded' });
    }

    // Convert age to number
    const age = Number(ageStr);
    if (isNaN(age)) {
      return res.status(400).json({ message: '❌ Age must be a number' });
    }

    // Auto assign size based on age
    let size;
    if (age < 1) {
      size = 'Small';
    } else if (age < 5) {
      size = 'Medium';
    } else {
      size = 'Large';
    }

    // Build image URL
    const imageUrl = `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}`;

    // Create new Dog document
    const newDog = new Dog({
      name,
      breed,
      age,
      gender,
      location,
      color,
      vaccinated,
      adoptionStatus,
      description,
      size,      // size assigned here
      imageUrl,
    });

    await newDog.save();

    res.status(201).json({ message: '✅ Dog uploaded successfully', dog: newDog });
  } catch (error) {
    console.error('❌ Upload Error:', error);
    res.status(500).json({ message: '❌ Failed to upload dog', error: error.message });
  }
});
//////////////////////////
// Contact message schema and model
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Contact = mongoose.model('Contact', contactSchema);

// POST /contact - Save contact form submissions
app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: '❌ All fields are required' });
    }

    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    res.status(200).json({ success: true, message: '✅ Message sent successfully!' });
  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({ success: false, message: '❌ Failed to send message', error: error.message });
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

