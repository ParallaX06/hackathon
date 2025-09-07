import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { toast } from 'react-toastify';

// Default map center (can be changed to your city's coordinates)
const DEFAULT_CENTER = {
  lat: 28.6139, // New Delhi coordinates as example
  lng: 77.2090
};

const MAP_OPTIONS = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
  gestureHandling: 'greedy'
};

// Low bandwidth map options
const LOW_BANDWIDTH_OPTIONS = {
  ...MAP_OPTIONS,
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    {
      featureType: 'all',
      stylers: [{ saturation: -80 }]
    }
  ]
};

const MapView = ({ buses, routes, selectedRoute, lowBandwidthMode }) => {
  const [map, setMap] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setMapCenter(location);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          toast.info('Using default location. Enable location for better experience.');
        }
      );
    }
  }, []);

  // Bus marker click handler
  const handleBusClick = useCallback((bus) => {
    setSelectedBus(bus);
  }, []);

  // Get bus icon based on status
  const getBusIcon = (bus) => {
    const baseIcon = {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="6" width="18" height="12" rx="2" fill="${bus.isActive ? '#4CAF50' : '#F44336'}"/>
          <rect x="5" y="8" width="3" height="2" fill="white"/>
          <rect x="16" y="8" width="3" height="2" fill="white"/>
          <circle cx="7" cy="16" r="1.5" fill="white"/>
          <circle cx="17" cy="16" r="1.5" fill="white"/>
          <text x="12" y="13" text-anchor="middle" fill="white" font-size="8">${bus.routeNumber || 'B'}</text>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(24, 24),
      anchor: new window.google.maps.Point(12, 12)
    };
    return baseIcon;
  };

  // Format last updated time
  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return 'More than a day ago';
  };

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="map-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          background: '#f5f5f5',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h3>🗺️ Map Configuration Required</h3>
          <p>Please add your Google Maps API key to the .env file</p>
          <code>REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here</code>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <LoadScript 
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        loadingElement={<div>Loading Map...</div>}
      >
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={14}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={lowBandwidthMode ? LOW_BANDWIDTH_OPTIONS : MAP_OPTIONS}
        >
          {/* User location marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="6" fill="#2196F3" stroke="white" stroke-width="2"/>
                    <circle cx="8" cy="8" r="2" fill="white"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(16, 16),
                anchor: new window.google.maps.Point(8, 8)
              }}
              title="Your Location"
            />
          )}

          {/* Bus markers */}
          {buses.map((bus) => (
            <Marker
              key={bus.id}
              position={{
                lat: bus.location.latitude,
                lng: bus.location.longitude
              }}
              icon={getBusIcon(bus)}
              onClick={() => handleBusClick(bus)}
              title={`Bus ${bus.routeNumber || bus.id} - ${bus.isActive ? 'Active' : 'Inactive'}`}
            />
          ))}

          {/* Info window for selected bus */}
          {selectedBus && (
            <InfoWindow
              position={{
                lat: selectedBus.location.latitude,
                lng: selectedBus.location.longitude
              }}
              onCloseClick={() => setSelectedBus(null)}
            >
              <div style={{ maxWidth: '200px' }}>
                <h4>🚌 Bus {selectedBus.routeNumber || selectedBus.id}</h4>
                <p><strong>Route:</strong> {selectedBus.routeName || 'Unknown Route'}</p>
                <p><strong>Status:</strong> {selectedBus.isActive ? '✅ Active' : '❌ Inactive'}</p>
                <p><strong>Speed:</strong> {selectedBus.speed || 0} km/h</p>
                <p><strong>Last Updated:</strong> {formatLastUpdated(selectedBus.lastUpdated)}</p>
                {selectedBus.nextStop && (
                  <p><strong>Next Stop:</strong> {selectedBus.nextStop}</p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapView;