import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from './components/Header';
import MapView from './components/MapView';
import RouteSelector from './components/RouteSelector';
import BusInfoPanel from './components/BusInfoPanel';
import LoadingSpinner from './components/LoadingSpinner';
import SimulationControl from './components/SimulationControl';
import ErrorBoundary from './components/ErrorBoundary';

// Services
import { subscribeToActiveBuses, getRoutes } from './services/firestoreService';

// Utils
import { isLowBandwidth } from './utils/networkUtils';

function App() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLowBandwidthMode, setIsLowBandwidthMode] = useState(false);

  // Check network conditions
  useEffect(() => {
    const checkBandwidth = async () => {
      const lowBandwidth = await isLowBandwidth();
      setIsLowBandwidthMode(lowBandwidth);
    };
    checkBandwidth();
  }, []);

  // Load routes on component mount
  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const routesData = await getRoutes();
        setRoutes(routesData);
      } catch (err) {
        console.error('Error loading routes:', err);
        setError('Failed to load routes');
      }
    };
    loadRoutes();
  }, []);

  // Subscribe to real-time bus updates
  useEffect(() => {
    const unsubscribe = subscribeToActiveBuses((busesData) => {
      setBuses(busesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter buses by selected route
  const filteredBuses = selectedRoute === 'all' 
    ? buses 
    : buses.filter(bus => bus.routeId === selectedRoute);

  if (loading) {
    return (
      <div className="App">
        <Header />
        <LoadingSpinner message="Loading transport data..." />
      </div>
    );
  }

  return (
    <Router>
      <ErrorBoundary>
        <div className="App">
        <Header />
        
        <Routes>
          <Route path="/" element={
            <main className="container">
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              {/* Mobile-first layout */}
              <div className="app-layout">
                <BusInfoPanel>
                  <RouteSelector
                    routes={routes}
                    selectedRoute={selectedRoute}
                    onRouteChange={setSelectedRoute}
                  />
                  
                  <div className="bus-stats">
                    <p>Active Buses: {filteredBuses.length}</p>
                    {isLowBandwidthMode && (
                      <p className="bandwidth-warning">
                        🔋 Low bandwidth mode
                      </p>
                    )}
                  </div>
                </BusInfoPanel>

                <MapView 
                  buses={filteredBuses}
                  routes={routes}
                  selectedRoute={selectedRoute}
                  lowBandwidthMode={isLowBandwidthMode}
                />
                
                <SimulationControl />
              </div>
            </main>
          } />
          
          <Route path="/driver" element={
            <div>Driver app will be loaded here</div>
          } />
          
          <Route path="/admin" element={
            <div>Admin dashboard will be loaded here</div>
          } />
        </Routes>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={isLowBandwidthMode}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;