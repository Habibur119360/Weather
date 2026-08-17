const weatherService = require('../services/weatherService');

/**
 * Controller to handle all weather & AQI HTTP requests
 */
const getWeather = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        success: false,
        error: 'Valid "lat" and "lon" query parameters are required.'
      });
    }

    const data = await weatherService.getCompleteWeatherData(lat, lon);
    return res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('getWeather controller error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error'
    });
  }
};

const searchCity = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required'
      });
    }

    const results = await weatherService.searchLocations(query);
    return res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('searchCity controller error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error'
    });
  }
};

const reverseGeocodeCity = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        success: false,
        error: 'Valid "lat" and "lon" query parameters are required.'
      });
    }

    const location = await weatherService.reverseGeocode(lat, lon);
    return res.json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('reverseGeocodeCity controller error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error'
    });
  }
};

module.exports = {
  getWeather,
  searchCity,
  reverseGeocodeCity
};
