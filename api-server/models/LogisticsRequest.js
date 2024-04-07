const mongoose = require('mongoose');

const logisticsRequestSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  volume: {
    type: Number,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  destination: {  
    type: String,
    required: true
  },
  timeline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    default: 'open', // possible values: 'open', 'in-progress', 'completed', 'cancelled'
    required: true
  },
  // Add additional fields as necessary
}, { timestamps: true });

const LogisticsRequest = mongoose.model('LogisticsRequest', logisticsRequestSchema);

module.exports = LogisticsRequest;
