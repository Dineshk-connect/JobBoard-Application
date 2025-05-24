const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
  },
  isRead: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true }); // ✅ Enable createdAt and updatedAt automatically

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
