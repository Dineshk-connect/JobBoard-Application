// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const applicationRoutes = require('./routes/applications');
const path = require('path');
const adminRoutes = require('./routes/admin');

// Middleware
app.use(cors());
app.use(express.json());


// Routes
const jobRoutes = require('./routes/job');
const employerRoutes = require('./routes/employer');
const candidateRoutes = require('./routes/candidates');



app.use('/api/jobs', jobRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/admin', adminRoutes);


// Database Connection
if (!MONGO_URI) {
  console.error(' MONGO_URI is not defined in .env file');
  process.exit(1); // Stop the server
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log(' MongoDB connected successfully');
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error(' MongoDB connection error:', err);
  process.exit(1); // Exit on connection failure
});
