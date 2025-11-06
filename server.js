const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Sample data for Dutch parcel service pickup/drop-off points
// In production, this would come from a database or external APIs
const locations = [
  // PostNL locations
  {
    id: 1,
    service: 'PostNL',
    name: 'PostNL Point - Albert Heijn Amsterdam',
    type: 'pickup',
    address: 'Damstraat 10',
    city: 'Amsterdam',
    postalCode: '1012JM',
    lat: 52.3702,
    lng: 4.8952,
    openingHours: 'Mon-Sat 8:00-20:00, Sun 10:00-18:00'
  },
  {
    id: 2,
    service: 'PostNL',
    name: 'PostNL Point - Bruna Rotterdam',
    type: 'both',
    address: 'Coolsingel 45',
    city: 'Rotterdam',
    postalCode: '3012AD',
    lat: 51.9244,
    lng: 4.4777,
    openingHours: 'Mon-Fri 9:00-18:00, Sat 9:00-17:00'
  },
  {
    id: 3,
    service: 'PostNL',
    name: 'PostNL Pakketpunt - Primera Utrecht',
    type: 'both',
    address: 'Oudegracht 158',
    city: 'Utrecht',
    postalCode: '3511AW',
    lat: 52.0907,
    lng: 5.1214,
    openingHours: 'Mon-Sat 8:00-19:00'
  },
  // DHL locations
  {
    id: 4,
    service: 'DHL',
    name: 'DHL ServicePoint - Shell Amsterdam',
    type: 'both',
    address: 'Overtoom 150',
    city: 'Amsterdam',
    postalCode: '1054HN',
    lat: 52.3600,
    lng: 4.8700,
    openingHours: 'Mon-Sun 6:00-23:00'
  },
  {
    id: 5,
    service: 'DHL',
    name: 'DHL Parcelshop - Kruidvat Rotterdam',
    type: 'both',
    address: 'Hoogstraat 123',
    city: 'Rotterdam',
    postalCode: '3011PL',
    lat: 51.9230,
    lng: 4.4850,
    openingHours: 'Mon-Sat 9:00-18:00'
  },
  // DPD locations
  {
    id: 6,
    service: 'DPD',
    name: 'DPD Pickup - Jumbo Den Haag',
    type: 'pickup',
    address: 'Spui 200',
    city: 'Den Haag',
    postalCode: '2511BX',
    lat: 52.0767,
    lng: 4.3115,
    openingHours: 'Mon-Sat 8:00-21:00, Sun 9:00-20:00'
  },
  {
    id: 7,
    service: 'DPD',
    name: 'DPD Pickup Parcelshop - Etos Utrecht',
    type: 'both',
    address: 'Vredenburg 50',
    city: 'Utrecht',
    postalCode: '3511BB',
    lat: 52.0930,
    lng: 5.1150,
    openingHours: 'Mon-Sat 8:30-18:30'
  },
  // GLS locations
  {
    id: 8,
    service: 'GLS',
    name: 'GLS ParcelShop - Primera Amsterdam',
    type: 'both',
    address: 'Kalverstraat 150',
    city: 'Amsterdam',
    postalCode: '1012XE',
    lat: 52.3680,
    lng: 4.8910,
    openingHours: 'Mon-Sat 9:00-18:00'
  },
  {
    id: 9,
    service: 'GLS',
    name: 'GLS ParcelShop - Sigarenmagazijn Rotterdam',
    type: 'both',
    address: 'Meent 96',
    city: 'Rotterdam',
    postalCode: '3011JM',
    lat: 51.9220,
    lng: 4.4820,
    openingHours: 'Mon-Fri 9:00-18:00, Sat 9:00-17:00'
  },
  // UPS locations
  {
    id: 10,
    service: 'UPS',
    name: 'UPS Access Point - Intertoys Den Haag',
    type: 'both',
    address: 'Grote Marktstraat 25',
    city: 'Den Haag',
    postalCode: '2511BH',
    lat: 52.0790,
    lng: 4.3120,
    openingHours: 'Mon-Sat 10:00-18:00'
  },
  {
    id: 11,
    service: 'UPS',
    name: 'UPS Access Point - Bruna Utrecht',
    type: 'pickup',
    address: 'Hoog Catharijne 123',
    city: 'Utrecht',
    postalCode: '3511GC',
    lat: 52.0900,
    lng: 5.1100,
    openingHours: 'Mon-Sat 9:00-19:00, Sun 11:00-18:00'
  },
  // Additional locations for better coverage
  {
    id: 12,
    service: 'PostNL',
    name: 'PostNL Point - AH Eindhoven',
    type: 'both',
    address: 'Rechtestraat 45',
    city: 'Eindhoven',
    postalCode: '5611GM',
    lat: 51.4381,
    lng: 5.4752,
    openingHours: 'Mon-Sat 8:00-20:00'
  },
  {
    id: 13,
    service: 'DHL',
    name: 'DHL ServicePoint - Esso Groningen',
    type: 'both',
    address: 'Verlengde Hereweg 58',
    city: 'Groningen',
    postalCode: '9721AB',
    lat: 53.2194,
    lng: 6.5665,
    openingHours: 'Mon-Sun 7:00-22:00'
  }
];

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

// Simple postal code to coordinates mapping (for demonstration)
// In production, use a proper geocoding service
const postalCodeCoordinates = {
  '1012': { lat: 52.3702, lng: 4.8952 }, // Amsterdam
  '3012': { lat: 51.9244, lng: 4.4777 }, // Rotterdam
  '3511': { lat: 52.0907, lng: 5.1214 }, // Utrecht
  '2511': { lat: 52.0767, lng: 4.3115 }, // Den Haag
  '5611': { lat: 51.4381, lng: 5.4752 }, // Eindhoven
  '9721': { lat: 53.2194, lng: 6.5665 }, // Groningen
  '1054': { lat: 52.3600, lng: 4.8700 }, // Amsterdam West
  '3011': { lat: 51.9230, lng: 4.4850 }  // Rotterdam Central
};

// API Routes

// Get all locations with optional filters
app.get('/api/locations', (req, res) => {
  const { service, type, postalCode, limit } = req.query;
  
  let filteredLocations = [...locations];
  
  // Filter by service
  if (service && service !== 'all') {
    filteredLocations = filteredLocations.filter(loc => 
      loc.service.toLowerCase() === service.toLowerCase()
    );
  }
  
  // Filter by type (pickup, dropoff, both)
  if (type) {
    filteredLocations = filteredLocations.filter(loc => 
      loc.type === type || loc.type === 'both'
    );
  }
  
  // Filter and sort by postal code proximity
  if (postalCode) {
    const postalPrefix = postalCode.replace(/\s/g, '').substring(0, 4);
    const coords = postalCodeCoordinates[postalPrefix];
    
    if (coords) {
      // Calculate distances and sort
      filteredLocations = filteredLocations.map(loc => ({
        ...loc,
        distance: calculateDistance(coords.lat, coords.lng, loc.lat, loc.lng)
      })).sort((a, b) => a.distance - b.distance);
    }
  }
  
  // Limit results
  if (limit) {
    filteredLocations = filteredLocations.slice(0, parseInt(limit));
  }
  
  res.json({
    success: true,
    count: filteredLocations.length,
    locations: filteredLocations
  });
});

// Get available services
app.get('/api/services', (req, res) => {
  const services = [...new Set(locations.map(loc => loc.service))];
  res.json({
    success: true,
    services: services
  });
});

// Get location by ID
app.get('/api/locations/:id', (req, res) => {
  const location = locations.find(loc => loc.id === parseInt(req.params.id));
  
  if (location) {
    res.json({
      success: true,
      location: location
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Location not found'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ParcelPinPoint API is running' });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`ParcelPinPoint server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to use the application`);
});
