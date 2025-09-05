import React, { useState, useEffect } from 'react';
import { Navigation, Play, Pause, Users, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { useTransport } from '../context/TransportContext';

export function DriverPanel() {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [speed, setSpeed] = useState(0);
  const [passengers, setPassengers] = useState(0);
  const { updateBusLocation } = useTransport();

  const driverInfo = {
    id: 'driver-001',
    name: 'Rajesh Kumar',
    busNumber: 'DL-01-AB-1234',
    route: 'Route 1: City Center → Airport',
    capacity: 50
  };

  // Mock GPS tracking
  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        // Simulate GPS location updates
        const mockLat = 28.7041 + (Math.random() - 0.5) * 0.01;
        const mockLng = 77.1025 + (Math.random() - 0.5) * 0.01;
        const mockSpeed = Math.floor(Math.random() * 60) + 10;
        
        setCurrentLocation({ lat: mockLat, lng: mockLng });
        setSpeed(mockSpeed);
        
        // Send to Firestore (mock)
        updateBusLocation({
          id: driverInfo.id,
          location: { lat: mockLat, lng: mockLng },
          speed: mockSpeed,
          passengers,
          timestamp: new Date()
        });
      }, 10000); // Update every 10 seconds

      return () => clearInterval(interval);
    }
  }, [isTracking, passengers, updateBusLocation]);

  const handleStartTracking = () => {
    setIsTracking(true);
    // Request GPS permission (mock)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('GPS error, using mock data');
          setCurrentLocation({ lat: 28.7041, lng: 77.1025 });
        }
      );
    }
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    setSpeed(0);
  };

  return (
    <div className="space-y-6">
      {/* Driver Info */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Navigation className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-800">Driver Dashboard</h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{driverInfo.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Bus Number:</span>
            <span className="font-medium font-mono">{driverInfo.busNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Route:</span>
            <span className="font-medium">{driverInfo.route.split(':')[0]}</span>
          </div>
        </div>
      </div>

      {/* GPS Tracking Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">GPS Tracking</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Status:</span>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              isTracking 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span>{isTracking ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
          
          {currentLocation && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Speed:</span>
                <span className="font-medium">{speed} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-mono text-sm">
                  {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                </span>
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t border-gray-200">
            {!isTracking ? (
              <button
                onClick={handleStartTracking}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start GPS Tracking</span>
              </button>
            ) : (
              <button
                onClick={handleStopTracking}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Pause className="w-5 h-5" />
                <span>Stop Tracking</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Passenger Count */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Users className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Passenger Count</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Current Passengers:</span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPassengers(Math.max(0, passengers - 1))}
                className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
              >
                -
              </button>
              <span className="font-bold text-xl w-12 text-center">{passengers}</span>
              <button
                onClick={() => setPassengers(Math.min(driverInfo.capacity, passengers + 1))}
                className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                passengers / driverInfo.capacity > 0.8 ? 'bg-red-500' :
                passengers / driverInfo.capacity > 0.6 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${(passengers / driverInfo.capacity) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Capacity: {driverInfo.capacity}</span>
            <span className={`font-medium ${
              passengers / driverInfo.capacity > 0.8 ? 'text-red-600' :
              passengers / driverInfo.capacity > 0.6 ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {passengers === 0 ? 'Empty' :
               passengers / driverInfo.capacity > 0.8 ? 'Nearly Full' :
               passengers / driverInfo.capacity > 0.6 ? 'Moderate' : 'Comfortable'}
            </span>
          </div>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-orange-900 mb-2">Safety Reminders</h3>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Keep GPS tracking on throughout your route</li>
              <li>• Update passenger count at each stop</li>
              <li>• Maintain safe driving speeds</li>
              <li>• Report any technical issues immediately</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}