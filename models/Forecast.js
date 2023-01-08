const mongoose = require('mongoose');

const ForecastData = new mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  forecast: [
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

module.exports = mongoose.model('ForecastData', ForecastData);
