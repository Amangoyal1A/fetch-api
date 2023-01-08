const mongoose = require('mongoose');

const WeatherData = new mongoose.Schema({
  city: {
    type: String,
    required: true
  },
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
});

module.exports = mongoose.model('WeatherData', WeatherData);
