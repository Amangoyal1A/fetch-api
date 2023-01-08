const mongoose = require('mongoose');

const HistoricalData = new mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  data: [
    {
      temperature: {
        type: Number,
        required: true
      },
      humidity: {
        type: Number,
        required: true
      },
      windSpeed: {
        type: Number,
        required: true
      },
      timestamp: {
        type: Date,
        required: true,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model('HistoricalData', HistoricalData);
