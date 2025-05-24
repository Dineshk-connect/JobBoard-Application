const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

//module.exports = mongoose.model('Candidate', candidateSchema);
module.exports = mongoose.models.Candidate || mongoose.model("Candidate", candidateSchema);