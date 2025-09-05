import React, { useState } from 'react';
import { BarChart3, Settings, Users, Bus, AlertCircle, TrendingUp } from 'lucide-react';

export function AdminDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  
  const stats = {
    totalBuses: 45,
    activeBuses: 32,
    totalPassengers: 1247,
    avgSpeed: 38,
    routeEfficiency: 87,
    customerSatisfaction: 4.2
  };

  const routes = [
    { id: 1, name: 'Route 1', buses: 8, avgDelay: 3, efficiency: 92 },
    { id: 2, name: 'Route 2', buses: 6, avgDelay: 5, efficiency: 85 },
    { id: 3, name: 'Route 3', buses: 7, avgDelay: 2, efficiency: 94 },
    { id: 4, name: 'Route 4', buses: 5, avgDelay: 8, efficiency: 78 },
    { id: 5, name: 'Route 5', buses: 6, avgDelay: 4, efficiency: 89 }
  ];

  const alerts = [
    { id: 1, type: 'warning', message: 'Bus DL-01-AB-5678 running 10 minutes late', time: '2 min ago' },
    { id: 2, type: 'info', message: 'Route 3 experiencing high demand', time: '5 min ago' },
    { id: 3, type: 'error', message: 'GPS signal lost for Bus DL-01-AB-9012', time: '8 min ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-800">System Overview</h2>
          </div>
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Bus className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-800">{stats.activeBuses}/{stats.totalBuses}</p>
                <p className="text-sm text-blue-600">Active Buses</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-800">{stats.totalPassengers.toLocaleString()}</p>
                <p className="text-sm text-green-600">Total Passengers</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-800">{stats.avgSpeed} km/h</p>
                <p className="text-sm text-purple-600">Avg Speed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Settings className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-800">{stats.routeEfficiency}%</p>
                <p className="text-sm text-orange-600">Route Efficiency</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Route Performance */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Route Performance</h3>
        <div className="space-y-3">
          {routes.map(route => (
            <div key={route.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">
                  {route.name}
                </div>
                <span className="text-gray-600">{route.buses} buses</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <p className="font-medium text-gray-800">{route.avgDelay}min</p>
                  <p className="text-gray-500">Avg Delay</p>
                </div>
                <div className="text-center">
                  <p className={`font-medium ${
                    route.efficiency > 90 ? 'text-green-600' :
                    route.efficiency > 80 ? 'text-yellow-600' : 'text-red-600'
                  }`}>{route.efficiency}%</p>
                  <p className="text-gray-500">Efficiency</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-800">System Alerts</h3>
        </div>
        
        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className={`flex items-start space-x-3 p-3 rounded-lg border-l-4 ${
              alert.type === 'error' ? 'bg-red-50 border-red-500' :
              alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
              'bg-blue-50 border-blue-500'
            }`}>
              <div className={`w-2 h-2 rounded-full mt-2 ${
                alert.type === 'error' ? 'bg-red-500' :
                alert.type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  alert.type === 'error' ? 'text-red-800' :
                  alert.type === 'warning' ? 'text-yellow-800' :
                  'text-blue-800'
                }`}>
                  {alert.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-left">
            Generate Daily Report
          </button>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-left">
            Add New Bus Route
          </button>
          <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-left">
            System Configuration
          </button>
        </div>
      </div>
    </div>
  );
}