# ParcelPinPoint

A web application to find the nearest parcel pickup and drop-off locations for major delivery services in The Netherlands.

## Features

- 🔍 **Search by Postal Code**: Find nearby pickup and drop-off points based on your postal code
- 🎯 **Filter by Service**: Filter results by specific delivery services (PostNL, DHL, DPD, GLS, UPS)
- 📦 **Location Types**: Filter by pickup-only or combined pickup/drop-off points
- 📍 **Distance Sorting**: Results are automatically sorted by distance from your postal code
- 🌐 **RESTful API**: Full-featured API for integrating location data into other applications
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Supported Delivery Services

- **PostNL** - Netherlands' national postal service
- **DHL** - International shipping and courier service
- **DPD** - Dynamic Parcel Distribution
- **GLS** - General Logistics Systems
- **UPS** - United Parcel Service

## Installation

1. Clone the repository:
```bash
git clone https://github.com/azurekid/ParcelPinPoint.git
cd ParcelPinPoint
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Get All Locations
```http
GET /api/locations
```

**Query Parameters:**
- `postalCode` (optional) - Filter and sort by proximity to postal code (e.g., `1012JM`)
- `service` (optional) - Filter by delivery service (`PostNL`, `DHL`, `DPD`, `GLS`, `UPS`)
- `type` (optional) - Filter by location type (`pickup` or `both`)
- `limit` (optional) - Limit the number of results

**Example Request:**
```bash
curl "http://localhost:3000/api/locations?postalCode=1012JM&service=PostNL&limit=5"
```

**Example Response:**
```json
{
  "success": true,
  "count": 5,
  "locations": [
    {
      "id": 1,
      "service": "PostNL",
      "name": "PostNL Point - Albert Heijn Amsterdam",
      "type": "pickup",
      "address": "Damstraat 10",
      "city": "Amsterdam",
      "postalCode": "1012JM",
      "lat": 52.3702,
      "lng": 4.8952,
      "openingHours": "Mon-Sat 8:00-20:00, Sun 10:00-18:00",
      "distance": 0.5
    }
  ]
}
```

#### Get Available Services
```http
GET /api/services
```

**Example Response:**
```json
{
  "success": true,
  "services": ["PostNL", "DHL", "DPD", "GLS", "UPS"]
}
```

#### Get Location by ID
```http
GET /api/locations/:id
```

**Example Request:**
```bash
curl "http://localhost:3000/api/locations/1"
```

**Example Response:**
```json
{
  "success": true,
  "location": {
    "id": 1,
    "service": "PostNL",
    "name": "PostNL Point - Albert Heijn Amsterdam",
    "type": "pickup",
    "address": "Damstraat 10",
    "city": "Amsterdam",
    "postalCode": "1012JM",
    "lat": 52.3702,
    "lng": 4.8952,
    "openingHours": "Mon-Sat 8:00-20:00, Sun 10:00-18:00"
  }
}
```

#### Health Check
```http
GET /api/health
```

**Example Response:**
```json
{
  "status": "ok",
  "message": "ParcelPinPoint API is running"
}
```

## Project Structure

```
ParcelPinPoint/
├── server.js           # Express server and API endpoints
├── package.json        # Node.js dependencies and scripts
├── public/             # Frontend static files
│   ├── index.html     # Main HTML page
│   ├── styles.css     # Styling
│   └── app.js         # Frontend JavaScript
└── README.md          # This file
```

## Technology Stack

- **Backend**: Node.js with Express
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: RESTful JSON API
- **Styling**: Custom CSS with responsive design

## Usage Examples

### Search for Locations Near a Postal Code

Visit the website and enter a postal code (e.g., `1012JM`) to find nearby pickup points.

### Filter by Service

Select a specific delivery service from the dropdown to see only locations for that provider.

### Use the API in Your Application

```javascript
// Fetch locations near postal code 1012JM
fetch('http://localhost:3000/api/locations?postalCode=1012JM')
  .then(response => response.json())
  .then(data => {
    console.log(`Found ${data.count} locations`);
    data.locations.forEach(loc => {
      console.log(`${loc.name} - ${loc.distance.toFixed(1)} km away`);
    });
  });
```

## Development

To run the application in development mode:

```bash
npm run dev
```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Future Enhancements

- Integration with real-time APIs from delivery services
- Interactive map visualization
- Real-time availability status
- Opening hours validation
- User authentication for saving favorite locations
- Mobile app version
- Support for more countries
- Route planning to locations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Contact

For questions or support, please open an issue on GitHub.

