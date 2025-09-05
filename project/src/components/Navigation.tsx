import React from 'react';
import { Bus, Users, Settings, Wifi, WifiOff } from 'lucide-react';

interface NavigationProps {
  currentView: 'commuter' | 'driver' | 'admin';
  onViewChange: (view: 'commuter' | 'driver' | 'admin') => void;
  isOnline: boolean;
}

export function Navigation({ currentView, onViewChange, isOnline }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Bus className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">SmartTransit</h1>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              SIH 2025
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewChange('commuter')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'commuter'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Commuter</span>
              </button>
              
              <button
                onClick={() => onViewChange('driver')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'driver'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Bus className="w-4 h-4" />
                <span>Driver</span>
              </button>
              
              <button
                onClick={() => onViewChange('admin')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'admin'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>
            
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              isOnline 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  <span>Offline</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}