import React, { useEffect, useRef, useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { Bus, MapPin, Navigation, Zap } from 'lucide-react';

export function MapContainer() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { buses, selectedBus, setSelectedBus } = useTransport();
  const [mapCenter, setMapCenter] = useState({ lat: 28.7041, lng: 77.1025 }); // Delhi center
  
  // Mock Google Maps implementation for demo
  const mockBuses = [
    {
      id: 'bus-001',
      route: 'Route 1: City Center → Airport',
      driver: 'Rajesh Kumar',
      location: { lat: 28.7041, lng: 77.1025 },
      speed: 35,
      passengers: 28,
      capacity: 50,
      nextStop: 'Metro Station',
      eta: 4,
      status: 'active'
    },
    {
      id: 'bus-002', 
      route: 'Route 2: Railway Station → Mall',
      driver: 'Priya Sharma',
      location: { lat: 28.6139, lng: 77.2090 },
      speed: 42,
      passengers: 15,
      capacity: 40,
      nextStop: 'Shopping Complex',
      eta: 7,
      status: 'active'
    },
    {
      id: 'bus-003',
      route: 'Route 3: University → Bus Stand',
      driver: 'Amit Singh',
      location: { lat: 28.5244, lng: 77.1855 },
      speed: 0,
      passengers: 35,
      capacity: 45,
      nextStop: 'Traffic Signal',
      eta: 2,
      status: 'stopped'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6" />
            <h2 className="text-xl font-bold">Live Bus Tracking</h2>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Real-time</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        {/* Mock Map Display */}
        <div 
          ref={mapRef}
          className="h-96 bg-gradient-to-br from-green-100 to-blue-100 relative overflow-hidden"
        >
          {/* Mock roads/streets pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-0.5 bg-gray-400 absolute top-1/4"></div>
            <div className="w-full h-0.5 bg-gray-400 absolute top-1/2"></div>
            <div className="w-full h-0.5 bg-gray-400 absolute top-3/4"></div>
            <div className="w-0.5 h-full bg-gray-400 absolute left-1/4"></div>
            <div className="w-0.5 h-full bg-gray-400 absolute left-1/2"></div>
            <div className="w-0.5 h-full bg-gray-400 absolute left-3/4"></div>
          </div>
          
          {/* Bus markers */}
          {mockBuses.map((bus, index) => (
            <div
              key={bus.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
                selectedBus?.id === bus.id ? 'z-20 scale-125' : 'z-10'
              }`}
              style={{
                left: `${20 + (index * 25)}%`,
                top: `${30 + (index * 20)}%`
              }}
              onClick={() => setSelectedBus(bus)}
            >
              <div className={`relative ${
                bus.status === 'active' ? 'animate-pulse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
                  bus.status === 'active' 
                    ? 'bg-green-500' 
                    : 'bg-orange-500'
                }`}>
                  <Bus className="w-4 h-4 text-white" />
                </div>
                
                {selectedBus?.id === bus.id && (
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-3 w-64 z-30 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{bus.route.split(':')[0]}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bus.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {bus.status === 'active' ? 'Moving' : 'Stopped'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{bus.route.split(': ')[1]}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Driver:</span>
                        <p className="font-medium">{bus.driver}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Speed:</span>
                        <p className="font-medium">{bus.speed} km/h</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Passengers:</span>
                        <p className="font-medium">{bus.passengers}/{bus.capacity}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">ETA:</span>
                        <p className="font-medium">{bus.eta} min</p>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <span className="text-gray-500 text-xs">Next Stop:</span>
                      <p className="font-medium text-sm">{bus.nextStop}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Navigation className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Map legend */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Active ({mockBuses.filter(b => b.status === 'active').length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Stopped ({mockBuses.filter(b => b.status === 'stopped').length})</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">Updates every 10 seconds</p>
        </div>
      </div>
    </div>
  );
}