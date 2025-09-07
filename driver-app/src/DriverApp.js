import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Demo mode configuration
const isDemoMode = true;

// Mock Firebase functions for demo
const mockFirebase = {
  updateDoc: async (ref, data) => {
    console.log('📍 Demo: Location updated:', data);
    return Promise.resolve();
  },
  doc: (db, collection, id) => ({ id, collection }),
  serverTimestamp: () => new Date()
};

const DriverApp = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [busId, setBusId] = useState(localStorage.getItem('driverBusId') || 'bus-001');
  const [routeNumber, setRouteNumber] = useState(localStorage.getItem('driverRouteNumber') || '42A');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [routeStatus, setRouteStatus] = useState('on-route');
  const [passengerCount, setPassengerCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const watchIdRef = useRef(null);
  const lastPositionRef = useRef(null);

  // Simulate notifications in demo mode
  useEffect(() => {
    const demoNotifications = [
      { id: 1, message: 'Route 42A: High passenger demand detected', type: 'info', time: '10:30 AM' },
      { id: 2, message: 'Traffic alert: Delay expected on Central Route', type: 'warning', time: '10:15 AM' },
      { id: 3, message: 'Welcome to TransitTracker Driver App!', type: 'success', time: '10:00 AM' }
    ];
    setNotifications(demoNotifications);
  }, []);

  // Update location to Firebase or demo
  const updateLocationToFirebase = async (position) => {
    if (!busId) {
      toast.error('Please enter Bus ID first');
      return;
    }

    try {
      const locationData = {
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        speed: position.coords.speed || 0,
        accuracy: position.coords.accuracy,
        heading: position.coords.heading,
        routeNumber: routeNumber,
        isActive: true,
        lastUpdated: isDemoMode ? new Date() : mockFirebase.serverTimestamp(),
        routeStatus: routeStatus,
        passengerCount: passengerCount
      };

      if (isDemoMode) {
        console.log('📍 Demo: Bus location updated:', locationData);
      } else {
        await mockFirebase.updateDoc(mockFirebase.doc(null, 'buses', busId), locationData);
      }
      
      setCurrentLocation(locationData.location);
      setSpeed(Math.round((position.coords.speed || 0) * 3.6)); // Convert m/s to km/h
      setLastUpdateTime(new Date());
      
      // Calculate speed if we have previous position
      if (lastPositionRef.current) {
        const distance = calculateDistance(
          lastPositionRef.current.coords.latitude,
          lastPositionRef.current.coords.longitude,
          position.coords.latitude,
          position.coords.longitude
        );
        const timeDiff = (position.timestamp - lastPositionRef.current.timestamp) / 1000; // seconds
        const calculatedSpeed = (distance * 1000 / timeDiff) * 3.6; // km/h
        
        if (calculatedSpeed > 0 && calculatedSpeed < 200) {
          setSpeed(Math.round(calculatedSpeed));
        }
      }
      
      lastPositionRef.current = position;
      
    } catch (error) {
      console.error('Error updating location:', error);
      if (!isDemoMode) {
        toast.error('Failed to update location: ' + error.message);
      }
    }
  };

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRadians = (degrees) => degrees * (Math.PI / 180);

  // Start location tracking
  const startTracking = () => {
    if (!busId.trim()) {
      toast.error('Please enter Bus ID');
      return;
    }

    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    // Save to localStorage
    localStorage.setItem('driverBusId', busId);
    localStorage.setItem('driverRouteNumber', routeNumber);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      updateLocationToFirebase,
      (error) => {
        console.error('Location error:', error);
        toast.error('Location tracking error: ' + error.message);
      },
      options
    );

    setIsTracking(true);
    toast.success('Started tracking location');
  };

  // Stop location tracking
  const stopTracking = async () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    // Mark bus as inactive
    if (busId) {
      try {
        if (isDemoMode) {
          console.log('🚫 Demo: Bus marked inactive:', busId);
        } else {
          await mockFirebase.updateDoc(mockFirebase.doc(null, 'buses', busId), {
            isActive: false,
            lastUpdated: mockFirebase.serverTimestamp()
          });
        }
      } catch (error) {
        console.error('Error marking bus inactive:', error);
      }
    }

    setIsTracking(false);
    toast.info('Stopped tracking location');
  };

  // Update route status
  const updateRouteStatus = (status) => {
    setRouteStatus(status);
    toast.success(`Route status updated to: ${status}`);
    
    if (isDemoMode) {
      console.log('🛣️ Demo: Route status updated:', status);
    }
  };

  // Send notification
  const sendNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message: message || 'Driver notification sent to passengers',
      type: 'info',
      time: new Date().toLocaleTimeString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    toast.success('Notification sent successfully!');
    
    if (isDemoMode) {
      console.log('📢 Demo: Notification sent:', newNotification);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '400px', 
      margin: '0 auto',
      fontFamily: 'Inter, Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '24px',
        borderRadius: '16px',
        textAlign: 'center',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          marginBottom: '8px',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>🚌 Driver Dashboard</h1>
        <p style={{ fontSize: '1rem', opacity: '0.9', fontWeight: '300' }}>Transport Tracker Pro</p>
        
        {/* Live Status Indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.1)',
            padding: '8px 16px',
            borderRadius: '12px'
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isTracking ? '#4CAF50' : '#FF9800',
              animation: isTracking ? 'pulse 2s infinite' : 'none'
            }}></div>
            <span style={{ fontSize: '14px' }}>{isTracking ? 'Live Tracking' : 'Offline'}</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.1)',
            padding: '8px 16px',
            borderRadius: '12px'
          }}>
            <span style={{ fontSize: '14px' }}>Route: {routeNumber || 'Not Set'}</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: '600',
          color: '#333',
          fontSize: '0.9rem'
        }}>
          Bus ID:
        </label>
        <input
          type="text"
          value={busId}
          onChange={(e) => setBusId(e.target.value)}
          placeholder="Enter your bus ID"
          disabled={isTracking}
          style={{
            width: '100%',
            padding: '14px 16px',
            border: '2px solid rgba(102, 126, 234, 0.2)',
            borderRadius: '12px',
            fontSize: '16px',
            boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.9)',
            transition: 'all 0.3s ease',
            fontFamily: 'Inter, sans-serif'
          }}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: '600',
          color: '#333',
          fontSize: '0.9rem'
        }}>
          Route Number:
        </label>
        <input
          type="text"
          value={routeNumber}
          onChange={(e) => setRouteNumber(e.target.value)}
          placeholder="Enter route number (optional)"
          disabled={isTracking}
          style={{
            width: '100%',
            padding: '14px 16px',
            border: '2px solid rgba(102, 126, 234, 0.2)',
            borderRadius: '12px',
            fontSize: '16px',
            boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.9)',
            transition: 'all 0.3s ease',
            fontFamily: 'Inter, sans-serif'
          }}
        />
      </div>

      {/* Enhanced Controls Section */}
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0', 
          color: '#333',
          fontSize: '1.2rem',
          fontWeight: '600'
        }}>Driver Controls</h3>
        
        {/* Quick Action Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => updateRouteStatus('on-time')}
            style={{
              padding: '12px 16px',
              background: routeStatus === 'on-time' ? '#4CAF50' : 'rgba(76, 175, 80, 0.1)',
              color: routeStatus === 'on-time' ? 'white' : '#4CAF50',
              border: '2px solid #4CAF50',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            ✅ On Time
          </button>
          
          <button
            onClick={() => updateRouteStatus('delayed')}
            style={{
              padding: '12px 16px',
              background: routeStatus === 'delayed' ? '#FF9800' : 'rgba(255, 152, 0, 0.1)',
              color: routeStatus === 'delayed' ? 'white' : '#FF9800',
              border: '2px solid #FF9800',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            ⏰ Delayed
          </button>
          
          <button
            onClick={() => sendNotification('Bus arriving at next stop in 2 minutes')}
            style={{
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            📢 Notify Stop
          </button>
          
          <button
            onClick={() => sendNotification('Traffic delay - ETA updated')}
            style={{
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            ⚠️ Traffic Alert
          </button>
        </div>
        
        {/* Passenger Count */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <label style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            minWidth: '120px'
          }}>Passenger Count:</label>
          <input
            type="number"
            value={passengerCount}
            onChange={(e) => setPassengerCount(parseInt(e.target.value) || 0)}
            min="0"
            max="60"
            style={{
              padding: '8px 12px',
              border: '2px solid rgba(102, 126, 234, 0.2)',
              borderRadius: '8px',
              fontSize: '14px',
              width: '80px'
            }}
          />
          <span style={{ fontSize: '12px', color: '#666' }}>/ 40 capacity</span>
        </div>
      </div>

      {/* Main Tracking Button */}
      <button
        onClick={isTracking ? stopTracking : startTracking}
        style={{
          width: '100%',
          padding: '18px 20px',
          background: isTracking 
            ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)' 
            : 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '16px',
          fontSize: '18px',
          fontWeight: '700',
          cursor: 'pointer',
          marginBottom: '24px',
          transition: 'all 0.3s ease',
          boxShadow: isTracking 
            ? '0 8px 25px rgba(244, 67, 54, 0.3)' 
            : '0 8px 25px rgba(76, 175, 80, 0.3)',
          fontFamily: 'Inter, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-3px)';
          e.target.style.boxShadow = isTracking 
            ? '0 12px 30px rgba(244, 67, 54, 0.4)' 
            : '0 12px 30px rgba(76, 175, 80, 0.4)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = isTracking 
            ? '0 8px 25px rgba(244, 67, 54, 0.3)' 
            : '0 8px 25px rgba(76, 175, 80, 0.3)';
        }}
      >
        {isTracking ? '⏹️ Stop Location Sharing' : '📍 Start Location Sharing'}
      </button>

      {/* Enhanced Tracking Status */}
      {isTracking && (
        <div style={{
          background: 'rgba(76, 175, 80, 0.1)',
          padding: '24px',
          borderRadius: '16px',
          border: '2px solid rgba(76, 175, 80, 0.3)',
          backdropFilter: 'blur(10px)',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#4CAF50',
              animation: 'pulse 2s infinite'
            }}></div>
            <h3 style={{ margin: '0', color: '#2e7d32', fontWeight: '600' }}>
              📍 Location Sharing Active
            </h3>
          </div>
          
          {currentLocation && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ background: 'rgba(255,255,255,0.8)', padding: '12px', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666', fontWeight: '500' }}>Latitude</p>
                <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#333' }}>{currentLocation.latitude.toFixed(6)}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.8)', padding: '12px', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666', fontWeight: '500' }}>Longitude</p>
                <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#333' }}>{currentLocation.longitude.toFixed(6)}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.8)', padding: '12px', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666', fontWeight: '500' }}>Speed</p>
                <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#333' }}>{speed} km/h</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.8)', padding: '12px', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666', fontWeight: '500' }}>Status</p>
                <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#333' }}>{routeStatus}</p>
              </div>
            </div>
          )}
          
          {lastUpdateTime && (
            <p style={{ margin: '0', fontSize: '14px', color: '#2e7d32' }}>
              <strong>Last Update:</strong> {lastUpdateTime.toLocaleTimeString()}
            </p>
          )}
        </div>
      )}

      {/* Notifications Panel */}
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          color: '#333',
          fontSize: '1.1rem',
          fontWeight: '600'
        }}>Recent Notifications</h3>
        
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {notifications.map((notification) => (
            <div key={notification.id} style={{
              padding: '12px 16px',
              marginBottom: '8px',
              background: notification.type === 'warning' ? 'rgba(255, 152, 0, 0.1)' : 
                         notification.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(33, 150, 243, 0.1)',
              border: `1px solid ${notification.type === 'warning' ? 'rgba(255, 152, 0, 0.3)' : 
                                   notification.type === 'success' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(33, 150, 243, 0.3)'}`,
              borderRadius: '8px',
              borderLeft: `4px solid ${notification.type === 'warning' ? '#FF9800' : 
                                       notification.type === 'success' ? '#4CAF50' : '#2196F3'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ margin: '0', fontSize: '14px', color: '#333', flex: 1 }}>
                  {notification.message}
                </p>
                <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
                  {notification.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#f5f5f5',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#666'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Instructions:</h4>
        <ol style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Enter your unique Bus ID</li>
          <li>Enter your route number (optional)</li>
          <li>Click "Start Tracking" to begin sharing location</li>
          <li>Keep the app open while driving</li>
          <li>Click "Stop Tracking" when your shift ends</li>
        </ol>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default DriverApp;