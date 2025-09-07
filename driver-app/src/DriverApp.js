import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Firebase (you'll need to copy the firebase config here too)
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Firebase configuration (same as main app)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "your_api_key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "your_project.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "your_project_id",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "your_project.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "your_app_id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DriverApp = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [busId, setBusId] = useState(localStorage.getItem('driverBusId') || '');
  const [routeNumber, setRouteNumber] = useState(localStorage.getItem('driverRouteNumber') || '');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [speed, setSpeed] = useState(0);
  const watchIdRef = useRef(null);
  const lastPositionRef = useRef(null);

  // Update location to Firebase
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
        lastUpdated: serverTimestamp()
      };

      await updateDoc(doc(db, 'buses', busId), locationData);
      
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
      toast.error('Failed to update location: ' + error.message);
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
        await updateDoc(doc(db, 'buses', busId), {
          isActive: false,
          lastUpdated: serverTimestamp()
        });
      } catch (error) {
        console.error('Error marking bus inactive:', error);
      }
    }

    setIsTracking(false);
    toast.info('Stopped tracking location');
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
        }}>🚌 Driver App</h1>
        <p style={{ fontSize: '1rem', opacity: '0.9', fontWeight: '300' }}>Transport Tracker</p>
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

      <button
        onClick={isTracking ? stopTracking : startTracking}
        style={{
          width: '100%',
          padding: '16px 20px',
          background: isTracking 
            ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)' 
            : 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '18px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '24px',
          transition: 'all 0.3s ease',
          boxShadow: isTracking 
            ? '0 4px 15px rgba(244, 67, 54, 0.3)' 
            : '0 4px 15px rgba(76, 175, 80, 0.3)',
          fontFamily: 'Inter, sans-serif'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = isTracking 
            ? '0 6px 20px rgba(244, 67, 54, 0.4)' 
            : '0 6px 20px rgba(76, 175, 80, 0.4)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = isTracking 
            ? '0 4px 15px rgba(244, 67, 54, 0.3)' 
            : '0 4px 15px rgba(76, 175, 80, 0.3)';
        }}
      >
        {isTracking ? '⏹️ Stop Tracking' : '▶️ Start Tracking'}
      </button>

      {isTracking && (
        <div style={{
          background: 'rgba(76, 175, 80, 0.1)',
          padding: '20px',
          borderRadius: '12px',
          border: '2px solid rgba(76, 175, 80, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#2e7d32', fontWeight: '600' }}>
            📍 Tracking Active
          </h3>
          
          {currentLocation && (
            <>
              <p><strong>Latitude:</strong> {currentLocation.latitude.toFixed(6)}</p>
              <p><strong>Longitude:</strong> {currentLocation.longitude.toFixed(6)}</p>
              <p><strong>Speed:</strong> {speed} km/h</p>
            </>
          )}
          
          {lastUpdateTime && (
            <p><strong>Last Update:</strong> {lastUpdateTime.toLocaleTimeString()}</p>
          )}
        </div>
      )}

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