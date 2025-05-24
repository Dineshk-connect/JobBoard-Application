const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Employer = require('../models/employer');
const Notification = require('../models/Notification'); // ✅ Import Notification model

// POST - Register Employer
router.post('/register', async (req, res) => {
  const { name, email, password, company } = req.body;

  try {
    const existingEmployer = await Employer.findOne({ email: email.toLowerCase().trim() });
    if (existingEmployer) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newEmployer = new Employer({
      name,
      email: email.toLowerCase().trim(),
      password,
      company,
    });

    await newEmployer.save();

    res.status(201).json({ message: 'Employer registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST - Login Employer
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = email.toLowerCase().trim();

    const employer = await Employer.findOne({ email: normalizedEmail });
    if (!employer) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const employerInfo = {
      _id: employer._id,
      name: employer.name,
      email: employer.email,
      company: employer.company,
    };

    res.status(200).json({ message: 'Login successful', employer: employerInfo });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET - Fetch Employer Notifications
router.get('/:id/notifications', async (req, res) => {
  try {
    const employerId = req.params.id;

    const notifications = await Notification.find({ employerId })
      .sort({ createdAt: -1 }) // Newest first
      .limit(50); // Limit to recent 50 notifications

    res.status(200).json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err.message);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});
// PATCH - Mark a notification as read
router.patch('/notifications/:id/read', async (req, res) => {
  try {
    const notificationId = req.params.id;

    const updated = await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error marking notification as read:', err.message);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});


module.exports = router;
