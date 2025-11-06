// API Base URL
const API_BASE = window.location.origin;

// DOM Elements
const postalCodeInput = document.getElementById('postalCode');
const serviceSelect = document.getElementById('service');
const typeSelect = document.getElementById('type');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');
const resultCountSpan = document.getElementById('resultCount');
const loadingSpinner = document.getElementById('loadingSpinner');
const noResultsDiv = document.getElementById('noResults');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    setupEventListeners();
    // Load all locations on initial page load
    searchLocations();
});

// Load available services from API
async function loadServices() {
    try {
        const response = await fetch(`${API_BASE}/api/services`);
        const data = await response.json();
        
        if (data.success) {
            data.services.forEach(service => {
                const option = document.createElement('option');
                option.value = service;
                option.textContent = service;
                serviceSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', searchLocations);
    
    // Allow Enter key to trigger search
    postalCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchLocations();
        }
    });
}

// Search for locations based on filters
async function searchLocations() {
    const postalCode = postalCodeInput.value.trim();
    const service = serviceSelect.value;
    const type = typeSelect.value;
    
    // Build query parameters
    const params = new URLSearchParams();
    if (postalCode) params.append('postalCode', postalCode);
    if (service && service !== 'all') params.append('service', service);
    if (type) params.append('type', type);
    
    // Show loading state
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/api/locations?${params.toString()}`);
        const data = await response.json();
        
        if (data.success) {
            displayResults(data.locations);
        } else {
            showNoResults();
        }
    } catch (error) {
        console.error('Error searching locations:', error);
        showError('Failed to load locations. Please try again.');
    }
}

// Display search results
function displayResults(locations) {
    hideLoading();
    
    if (locations.length === 0) {
        showNoResults();
        return;
    }
    
    noResultsDiv.classList.add('hidden');
    resultsDiv.classList.remove('hidden');
    
    // Update result count
    resultCountSpan.textContent = `${locations.length} location${locations.length !== 1 ? 's' : ''} found`;
    
    // Clear previous results
    resultsDiv.innerHTML = '';
    
    // Create location cards
    locations.forEach(location => {
        const card = createLocationCard(location);
        resultsDiv.appendChild(card);
    });
}

// Create a location card element
function createLocationCard(location) {
    const card = document.createElement('div');
    card.className = 'location-card';
    
    const serviceBadge = document.createElement('span');
    serviceBadge.className = `service-badge service-${location.service}`;
    serviceBadge.textContent = location.service;
    
    const typeBadge = document.createElement('span');
    typeBadge.className = 'type-badge';
    typeBadge.textContent = location.type === 'both' ? '📦 Pickup & Drop-off' : '📦 Pickup Only';
    
    const name = document.createElement('div');
    name.className = 'location-name';
    name.textContent = location.name;
    
    const address = document.createElement('div');
    address.className = 'location-address';
    address.textContent = location.address;
    
    const cityPostal = document.createElement('div');
    cityPostal.className = 'location-postal';
    cityPostal.textContent = `${location.postalCode} ${location.city}`;
    
    const hours = document.createElement('div');
    hours.className = 'location-hours';
    hours.innerHTML = `<strong>⏰ Opening Hours:</strong><br>${location.openingHours}`;
    
    card.appendChild(serviceBadge);
    card.appendChild(typeBadge);
    card.appendChild(name);
    card.appendChild(address);
    card.appendChild(cityPostal);
    card.appendChild(hours);
    
    // Add distance badge if available
    if (location.distance !== undefined) {
        const distanceBadge = document.createElement('span');
        distanceBadge.className = 'distance-badge';
        distanceBadge.textContent = `${location.distance.toFixed(1)} km`;
        card.appendChild(distanceBadge);
    }
    
    return card;
}

// Show loading spinner
function showLoading() {
    loadingSpinner.classList.remove('hidden');
    resultsDiv.classList.add('hidden');
    noResultsDiv.classList.add('hidden');
    resultCountSpan.textContent = '';
}

// Hide loading spinner
function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

// Show no results message
function showNoResults() {
    hideLoading();
    resultsDiv.classList.add('hidden');
    noResultsDiv.classList.remove('hidden');
    resultCountSpan.textContent = '0 locations found';
}

// Show error message
function showError(message) {
    hideLoading();
    resultsDiv.classList.add('hidden');
    noResultsDiv.classList.remove('hidden');
    noResultsDiv.innerHTML = `<p style="color: #dc3545;">${message}</p>`;
}
