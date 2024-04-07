require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/userRoutes');
const logisticsRequestRoutes = require('./routes/logisticsRequests');
const bidRoutes = require('./routes/bidRoutes');
const cors = require('cors');




const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use('/api', authRoutes);// for parsing application/json
app.use('/api/logistics', logisticsRequestRoutes);
app.use('/api/bid', bidRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Routes
app.get('/', (req, res) => {
  res.send('Logistics Negotiation Engine API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

