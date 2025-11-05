const User = require('../db/model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTER USER
const register = async (req, res) => {
  try {
    console.log('🧾 REGISTER REQUEST BODY:', req.body);

    const { firstName, lastName, middleName, contactNumber, address, username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      middleName,
      contactNumber,
      address,
      username,
      password: hashedPassword,
    });

    console.log('✅ USER REGISTERED:', newUser.username);
    res.status(201).json({ message: "User registered successfully", userId: newUser._id });
  } catch (error) {
    console.error('🔥 REGISTER ERROR:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// LOGIN USER
const login = async (req, res) => {
  try {
    console.log('🧠 LOGIN REQUEST BODY:', req.body);

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Password mismatch for:', username);
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    console.log('✅ LOGIN SUCCESS:', username);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error('🔥 LOGIN ERROR:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { register, login };
