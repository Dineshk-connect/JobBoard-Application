const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: Number, required: true },
  views: { type: Number, default: 0 },


  // 👇 Add this field to associate with Employer
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer',
    required: true
  }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
