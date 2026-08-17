const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const {
  getWeather,
  searchCity,
  reverseGeocodeCity
} = require('./controllers/weatherController');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Weather, AQI & Humidity Real-Time API',
    time: new Date().toISOString()
  });
});

// Main Weather & AQI bundle endpoint
app.get('/api/weather', getWeather);

// City geocoding search
app.get('/api/search', searchCity);

// Reverse geocoding for GPS coordinate lookup
app.get('/api/reverse-geocode', reverseGeocodeCity);

// Serve frontend static build if available (for 1-click fullstack deployment)
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      next();
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Weather & AQI Backend server running at http://localhost:${PORT}`);
});
