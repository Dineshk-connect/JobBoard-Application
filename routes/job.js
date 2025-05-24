const express = require('express');
const router = express.Router();
const Job = require('../models/job');

// POST - Create a new job
router.post('/', async (req, res) => {
  try {
    const employerId = req.body.createdBy;
    if (!employerId) return res.status(400).json({ message: 'Missing employer ID' });

    const newJob = new Job({ ...req.body, createdBy: employerId });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET - List all jobs or by employerId
router.get('/', async (req, res) => {
  try {
    const employerId = req.query.employerId;
    let jobs;
    if (employerId) {
      jobs = await Job.find({ createdBy: employerId });
    } else {
      jobs = await Job.find();
    }
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT - Update a job by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(updatedJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - Delete a job by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Increment view count for a job
router.post('/:jobId/view', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    job.views = (job.views || 0) + 1;
    await job.save();

    res.json({ message: 'View count incremented', views: job.views });
  } catch (error) {
    res.status(500).json({ message: 'Failed to increment views', error: error.message });
  }
});

// GET - Total views count for an employer
router.get('/employer/:employerId/views-count', async (req, res) => {
  try {
    const employerId = req.params.employerId;
    const jobs = await Job.find({ createdBy: employerId });

    const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);

    res.json({ views: totalViews });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get views count', error: err.message });
  }
});

module.exports = router;
