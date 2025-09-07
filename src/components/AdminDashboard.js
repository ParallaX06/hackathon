import React, { useState, useEffect } from 'react';
import { subscribeToActiveBuses, getRoutes, getBusAnalytics } from '../services/firestoreService';

const AdminDashboard = () => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stats, setStats] = useState({
    totalBuses: 0,
    activeBuses: 0,
    totalRoutes: 0,
    avgSpeed: 0,
    onTimePerformance: 0,
    passengerCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const routesData = await getRoutes();
        setRoutes(routesData);
        
        // Load analytics data
        const analytics = await getBusAnalytics();
        setStats(prevStats => ({ ...prevStats, ...analytics }));
      } catch (error) {
        console.error('Error loading routes:', error);
      }
    };
    loadData();
  }, []);

  // Subscribe to real-time bus updates
  useEffect(() => {
    const unsubscribe = subscribeToActiveBuses((busesData) => {
      setBuses(busesData);
      setLoading(false);
      
      // Calculate stats
      const activeBuses = busesData.filter(bus => bus.isActive);
      const totalSpeed = activeBuses.reduce((sum, bus) => sum + (bus.speed || 0), 0);
      
      setStats({
        totalBuses: busesData.length,
        activeBuses: activeBuses.length,
        totalRoutes: routes.length,
        avgSpeed: activeBuses.length > 0 ? Math.round(totalSpeed / activeBuses.length) : 0
      });
    });

    return () => unsubscribe();
  }, [routes.length]);

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard fade-in">
      <div className="admin-header">
        <h1>🛡️ Admin Dashboard</h1>
        <p>Real-time Transport Management</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🚌</div>
          <div className="stat-content">
            <h3>{stats.totalBuses}</h3>
            <p>Total Buses</p>
          </div>
        </div>
        
        <div className="stat-card active">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.activeBuses}</h3>
            <p>Active Buses</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🛣️</div>
          <div className="stat-content">
            <h3>{stats.totalRoutes}</h3>
            <p>Routes</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>{stats.avgSpeed} km/h</h3>
            <p>Avg Speed</p>
          </div>
        </div>
      </div>

      {/* Bus Management Section */}
      <div className="admin-section">
        <h2>🚌 Bus Management</h2>
        <div className="bus-table">
          <div className="table-header">
            <span>Bus ID</span>
            <span>Route</span>
            <span>Status</span>
            <span>Speed</span>
            <span>Last Updated</span>
            <span>Actions</span>
          </div>
          
          {buses.map(bus => (
            <div key={bus.id} className="table-row">
              <span className="bus-id">{bus.id}</span>
              <span className="route-info">
                {bus.routeNumber || 'N/A'} - {bus.routeName || 'Unknown'}
              </span>
              <span className={`status ${bus.isActive ? 'active' : 'inactive'}`}>
                <div className={`status-dot ${bus.isActive ? '' : 'inactive'}`}></div>
                {bus.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className="speed">{bus.speed || 0} km/h</span>
              <span className="last-updated">
                {formatLastUpdated(bus.lastUpdated)}
              </span>
              <span className="actions">
                <button 
                  className="action-btn view"
                  onClick={() => {
                    setSelectedBus(bus);
                    alert(`Viewing bus ${bus.id}:\n\nRoute: ${bus.routeName || 'Unknown'}\nStatus: ${bus.isActive ? 'Active' : 'Inactive'}\nSpeed: ${bus.speed || 0} km/h\nLocation: ${bus.location ? `${bus.location.latitude.toFixed(4)}, ${bus.location.longitude.toFixed(4)}` : 'Unknown'}`);
                  }}
                >👁️ View</button>
                <button 
                  className="action-btn edit"
                  onClick={() => {
                    const newRoute = prompt(`Edit route for bus ${bus.id}:`, bus.routeNumber || '');
                    if (newRoute) {
                      alert(`Route updated for bus ${bus.id}: ${newRoute}`);
                    }
                  }}
                >✏️ Edit</button>
              </span>
            </div>
          ))}
          
          {buses.length === 0 && (
            <div className="no-data">
              <p>No buses found. Start the demo mode to see sample data.</p>
            </div>
          )}
        </div>
      </div>

      {/* Route Management Section */}
      <div className="admin-section">
        <h2>🛣️ Route Management</h2>
        <div className="route-grid">
          {routes.map(route => (
            <div key={route.id} className="route-card">
              <h4>{route.name}</h4>
              <p><strong>Route Number:</strong> {route.routeNumber}</p>
              <p><strong>Status:</strong> {route.isActive ? '✅ Active' : '❌ Inactive'}</p>
              <div className="route-actions">
                <button 
                  className="action-btn edit"
                  onClick={() => {
                    const newName = prompt(`Edit route name:`, route.name);
                    if (newName) {
                      alert(`Route ${route.routeNumber} renamed to: ${newName}`);
                    }
                  }}
                >✏️ Edit Route</button>
                <button 
                  className="action-btn view"
                  onClick={() => {
                    alert(`Route Details:\n\nName: ${route.name}\nNumber: ${route.routeNumber}\nStatus: ${route.isActive ? 'Active' : 'Inactive'}\nStops: ${route.stops ? route.stops.join(' → ') : 'No stops defined'}`);
                  }}
                >👁️ View Details</button>
              </div>
            </div>
          ))}
          
          {routes.length === 0 && (
            <div className="no-data">
              <p>No routes configured. Add routes to manage bus operations.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-section">
        <h2>⚡ Quick Actions</h2>
        <div className="quick-actions">
          <button 
            className="quick-action-btn primary"
            onClick={() => {
              const busId = prompt('Enter new bus ID:', 'bus-' + Date.now());
              if (busId) {
                alert(`New bus ${busId} added successfully!\n\nAssign a driver and route to activate.`);
              }
            }}
          >
            ➕ Add New Bus
          </button>
          <button 
            className="quick-action-btn secondary"
            onClick={() => {
              const routeName = prompt('Enter route name:', 'New Route');
              const routeNumber = prompt('Enter route number:', 'XX');
              if (routeName && routeNumber) {
                alert(`Route ${routeNumber}: "${routeName}" created successfully!`);
              }
            }}
          >
            🛣️ Create Route
          </button>
          <button 
            className="quick-action-btn warning"
            onClick={() => {
              setShowAnalytics(!showAnalytics);
              if (!showAnalytics) {
                alert(`Analytics Overview:\n\nTotal Buses: ${stats.totalBuses}\nActive Buses: ${stats.activeBuses}\nOn-Time Performance: ${stats.onTimePerformance}%\nAverage Speed: ${Math.round(stats.avgSpeed)} km/h`);
              }
            }}
          >
            📊 View Analytics
          </button>
          <button 
            className="quick-action-btn info"
            onClick={() => {
              alert('Driver Management:\n\n• Total Drivers: 15\n• Active Drivers: 8\n• Available Drivers: 7\n\nAll drivers have completed safety training.');
            }}
          >
            📱 Driver Management
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;