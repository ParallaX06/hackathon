import React, { useState } from 'react';
import { Clock, MapPin, Users, AlertCircle, Search } from 'lucide-react';

export function CommuterDashboard() {
  const [selectedStop, setSelectedStop] = useState('');
  
  const busStops = [
    'Metro Station',
    'Shopping Complex', 
    'Railway Station',
    'University',
    'Hospital',
    'Bus Stand',
    'Airport',
    'City Center'
  ];

  const nearbyBuses = [
    {
      id: 'bus-001',
      route: 'Route 1',
      destination: 'Airport',
      eta: 4,
      crowding: 'medium',
      nextStops: ['Metro Station', 'Shopping Mall', 'Airport']
    },
    {
      id: 'bus-002', 
      route: 'Route 2',
      destination: 'Railway Station',
      eta: 7,
      crowding: 'low',
      nextStops: ['Shopping Complex', 'City Center', 'Railway Station']
    },
    {
      id: 'bus-003',
      route: 'Route 3', 
      destination: 'University',
      eta: 12,
      crowding: 'high',
      nextStops: ['Traffic Signal', 'Hospital', 'University']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stop Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Find Your Bus</h2>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={selectedStop}
            onChange={(e) => setSelectedStop(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Select your bus stop</option>
            {busStops.map(stop => (
              <option key={stop} value={stop}>{stop}</option>
            ))}
          </select>
        </div>
        
        {selectedStop && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <MapPin className="w-4 h-4 inline mr-1" />
              Showing buses for: <strong>{selectedStop}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Nearby Buses */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Nearby Buses</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live updates</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {nearbyBuses.map(bus => (
            <div key={bus.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {bus.route}
                  </div>
                  <span className="font-medium text-gray-800">→ {bus.destination}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-lg font-bold text-green-600">{bus.eta} min</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      bus.crowding === 'low' ? 'bg-green-100 text-green-800' :
                      bus.crowding === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {bus.crowding === 'low' ? 'Low' : bus.crowding === 'medium' ? 'Medium' : 'High'} crowding
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Next stops:</p>
                <div className="flex flex-wrap gap-2">
                  {bus.nextStops.map(stop => (
                    <span key={stop} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {stop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Pro Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• ETA calculations include current traffic conditions</li>
              <li>• Green crowding = comfortable seating available</li>
              <li>• Red crowding = bus may be full, consider next one</li>
              <li>• Tap any bus on the map for detailed information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}