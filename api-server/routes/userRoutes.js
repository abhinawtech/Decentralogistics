const express = require('express');
const User = require('../models/User'); // Adjust the path as per your project structure
const auth = require('../middleware/auth'); // Your existing auth middleware
const router = new express.Router();

// User Signup
router.post('/users/signup', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken(); // Assuming this method exists on your User model
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// User Login
router.post('/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findByCredentials(username, password); // Assuming this static method exists on your User model
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// User Profile Update
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'email', 'password']; // Add or remove fields based on your User model
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get My Profile
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});



// Assuming role checking logic in your auth middleware, 
// you can expand role-based functionalities as needed.

module.exports = router;
