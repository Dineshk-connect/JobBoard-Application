const express = require('express');
const bcrypt = require('bcrypt');
const Candidate = require('../models/Candidates');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await Candidate.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCandidate = new Candidate({ name, email, password: hashedPassword });

    const savedCandidate = await newCandidate.save();
    res.status(201).json({ _id: savedCandidate._id, name: savedCandidate.name, email: savedCandidate.email });
  } catch (err) {
    res.status(500).json({ message: 'Error registering candidate', error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await Candidate.findOne({ email });

    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    const isMatch = await bcrypt.compare(password, candidate.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    res.json({ _id: candidate._id, name: candidate.name, email: candidate.email });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
});

// Update profile route
router.put('/:id', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const updateFields = { name, email };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json({
      _id: updatedCandidate._id,
      name: updatedCandidate.name,
      email: updatedCandidate.email,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

module.exports = router;