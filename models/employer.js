// models/employer.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // For hashing passwords

const employerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  company: {
    type: String,
    default: ''
  }
});

// Hash the password before saving the employer document
// DO NOT hash in route; let this schema hook handle it
employerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


// Method to compare entered password with stored hashed password
employerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);  // Compare entered password with the hashed one
};

const Employer = mongoose.model('Employer', employerSchema);

module.exports = Employer;
