const express = require('express');
const router = express.Router();
const Application = require('../models/applications');
const Notification = require('../models/Notification'); // ✅ Already present
const multer = require('multer');
const path = require('path');
const Job = require('../models/job');
const { sendStatusEmail } = require('../utils/mailer');
const candidate = require('../models/Candidates');

// File upload config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Apply for a job
router.post('/apply', upload.single('resume'), async (req, res) => {
  try {
    const { jobId, candidateId } = req.body;

    if (!jobId || !candidateId) {
      return res.status(400).json({ message: 'Missing jobId or candidateId' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    // Prevent duplicate application
    const existing = await Application.findOne({ jobId, candidateId });
    if (existing) {
      return res.status(409).json({ message: 'Already applied' });
    }

    const resumePath = req.file.path;
    const application = new Application({ jobId, candidateId, resumePath });
    await application.save();

    // 🔔 Create notification for employer
    const job = await Job.findById(jobId).populate('createdBy');
    if (job && job.createdBy) {
      const notification = new Notification({
        employerId: job.createdBy._id,
        applicationId: application._id,
        message: `New application received for your job "${job.title}"`,
        isRead: false,
        createdAt: new Date()
      });
      await notification.save();
    }

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get applications for candidate
router.get('/candidate/:candidateId', async (req, res) => {
  try {
    const candidateId = req.params.candidateId;
    const applications = await Application.find({ candidateId }).populate({
       path: 'jobId',
      select: 'title company location'
    });
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error while fetching applications' });
  }
});

// Count applications for an employer
router.get('/employer/:employerId/applications-count', async (req, res) => {
  try {
    const employerId = req.params.employerId;
    const jobs = await Job.find({ createdBy: employerId }, '_id');

    if (!jobs.length) {
      return res.json({ applicationsCount: 0 });
    }

    const jobIds = jobs.map(job => job._id);
    const applicationsCount = await Application.countDocuments({ jobId: { $in: jobIds } });

    res.json({ count: applicationsCount });
  } catch (error) {
    console.error('Error counting applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applications received by employer
router.get('/employer/:employerId/applications', async (req, res) => {
  try {
    const employerId = req.params.employerId;
    const jobs = await Job.find({ createdBy: employerId }, '_id');
    const jobIds = jobs.map(job => job._id);

    if (jobIds.length === 0) {
      return res.status(200).json([]);
    }

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('jobId')
      .populate('candidateId');

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch applications', error: err.message });
  }
});

router.put('/:applicationId/status', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    //console.log(`Updating status for application ID: ${applicationId} to ${status}`);

    const updatedApp = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    ).populate('candidateId'); // Try populating candidate

    if (!updatedApp) {
     // console.log("❌ Application not found");
      return res.status(404).json({ message: 'Application not found' });
    }

  //  console.log("✅ Updated Application:", updatedApp);

    // Check if candidate data is populated
    let candidateEmail = updatedApp?.candidateId?.email;

    // Fallback: fetch manually if not populated
    if (!candidateEmail) {
     // console.log("⚠️ candidateId not populated. Fetching manually...");
      const candidate = await Candidate.findById(updatedApp.candidateId);
      if (!candidate) {
       // console.log("❌ Candidate not found");
        return res.status(404).json({ message: 'Candidate not found' });
      }
      candidateEmail = candidate.email;
    }

   // console.log(`📧 Sending status email to: ${candidateEmail}`);

    const subject = `Your Job Application Status: ${status}`;
    const message =
      status === 'Accepted'
        ? 'Congratulations! Your application has been accepted. We will get back to you soon.'
        : 'We regret to inform you that your application was not selected. Thank you for applying.';

    await sendStatusEmail(candidateEmail, subject, message);

   // console.log("✅ Email sent successfully.");
    res.json(updatedApp);
  } catch (error) {
   // console.error("❌ Error in updating status and sending email:", error);
    res.status(500).json({ message: 'Error updating status' });
  }
});
// routes/applications.js
router.delete('/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const deleted = await Application.findByIdAndDelete(applicationId);
    if (!deleted) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    console.error('Error deleting application:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
