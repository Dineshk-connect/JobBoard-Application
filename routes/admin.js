const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");
const Candidate = require("../models/candidates");
const Employer = require("../models/employer");
const Job = require("../models/job");
const Application = require("../models/applications");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id }, 'your_jwt_secret', { expiresIn: '1d' });
    res.json({ token, adminId: admin._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/candidates
router.get("/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find({}, "name email");
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidates" });
  }
});

// GET /api/admin/employers
router.get("/employers", async (req, res) => {
  try {
    const employers = await Employer.find({}, "company email");

    res.json(employers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employers" });
  }
});

// GET /api/admin/jobs
router.get("/jobs", async (req, res) => {
  try {
   const jobs = await Job.find({}, "title company location");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

// GET /api/admin/applications
router.get("/applications", async (req, res) => {
  try {
    const applications = await Application.find({}, "candidateId jobId status");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications" });
  }
});
// DELETE Candidate
router.delete("/candidates/:id", async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting candidate" });
  }
});

// DELETE Employer
router.delete("/employers/:id", async (req, res) => {
  try {
    await Employer.findByIdAndDelete(req.params.id);
    res.json({ message: "Employer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employer" });
  }
});


module.exports = router;
