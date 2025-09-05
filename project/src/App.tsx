import React, { useState, useEffect } from 'react';
import { MapContainer } from './components/MapContainer';
import { DriverPanel } from './components/DriverPanel';
import { CommuterDashboard } from './components/CommuterDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Navigation } from './components/Navigation';
import { initializeFirebase } from './firebase/config';
import { TransportProvider } from './context/TransportContext';
import { Loader2 } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<'commuter' | 'driver' | 'admin'>('commuter');
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Initialize Firebase
    initializeFirebase();
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Monitor online status for low-bandwidth optimization
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">SmartTransit</h2>
          <p className="text-gray-600">Loading real-time transport data...</p>
        </div>
      </div>
    );
  }

  return (
    <TransportProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation 
          currentView={currentView} 
          onViewChange={setCurrentView}
          isOnline={isOnline}
        />
        
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MapContainer />
            </div>
            
            <div className="lg:col-span-1">
              {currentView === 'commuter' && <CommuterDashboard />}
              {currentView === 'driver' && <DriverPanel />}
              {currentView === 'admin' && <AdminDashboard />}
            </div>
          </div>
        </main>
      </div>
    </TransportProvider>
  );
}

export default App;