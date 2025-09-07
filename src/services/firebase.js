// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, collection, doc, updateDoc, onSnapshot, addDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "hackathon-transport.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "hackathon-transport",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "hackathon-transport.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Check if we're in demo mode
export const isDemoMode = process.env.REACT_APP_DEMO_MODE === 'true' || 
  process.env.REACT_APP_FIREBASE_API_KEY === 'demo-api-key';

// Initialize Firebase
let app, db, auth, functions;

if (isDemoMode) {
  // In demo mode, create mock objects with enhanced functionality
  console.log('🎭 Running in Demo Mode - Enhanced simulation active');
  
  // Enhanced mock database with in-memory storage
  const mockData = {
    buses: new Map(),
    routes: new Map(),
    notifications: new Map()
  };

  // Initialize demo data
  const initDemoData = () => {
    // Demo buses
    mockData.buses.set('bus-001', {
      id: 'bus-001',
      routeNumber: '42A',
      routeName: 'City Center - Airport',
      routeId: 'route-1',
      isActive: true,
      speed: 35,
      location: { latitude: 28.6139, longitude: 77.2090 },
      lastUpdated: new Date(),
      nextStop: 'Central Station',
      driverId: 'driver-001',
      capacity: 40,
      currentPassengers: 28
    });
    
    mockData.buses.set('bus-002', {
      id: 'bus-002',
      routeNumber: '15B',
      routeName: 'Mall - University', 
      routeId: 'route-2',
      isActive: true,
      speed: 28,
      location: { latitude: 28.6169, longitude: 77.2120 },
      lastUpdated: new Date(),
      nextStop: 'Shopping Complex',
      driverId: 'driver-002',
      capacity: 45,
      currentPassengers: 33
    });
    
    // Demo routes
    mockData.routes.set('route-1', {
      id: 'route-1',
      routeNumber: '42A',
      name: 'City Center - Airport',
      isActive: true,
      stops: ['City Center', 'Central Station', 'Airport Terminal'],
      estimatedTime: 45
    });
  };

  initDemoData();
  
  // Enhanced mock objects with full functionality
  db = {
    _type: 'mock-firestore',
    collection: (name) => ({
      doc: (id) => ({
        update: async (data) => {
          if (mockData[name]?.has(id)) {
            mockData[name].set(id, { ...mockData[name].get(id), ...data, lastUpdated: new Date() });
          }
          return Promise.resolve();
        },
        set: async (data) => {
          mockData[name]?.set(id, { ...data, id, lastUpdated: new Date() });
          return Promise.resolve();
        },
        get: async () => ({
          exists: () => mockData[name]?.has(id),
          data: () => mockData[name]?.get(id)
        })
      }),
      add: async (data) => {
        const id = 'mock-' + Date.now();
        mockData[name]?.set(id, { ...data, id, lastUpdated: new Date() });
        return Promise.resolve({ id });
      },
      where: () => ({ onSnapshot: (callback) => callback({ docs: Array.from(mockData[name]?.values() || []).map(data => ({ data: () => data })) }) }),
      onSnapshot: (callback) => {
        callback({ docs: Array.from(mockData[name]?.values() || []).map(data => ({ data: () => data })) });
        return () => {}; // unsubscribe function
      }
    }),
    mockData // Expose for direct access
  };
  
  auth = { _type: 'mock-auth' };
  functions = { _type: 'mock-functions' };
} else {
  // Initialize real Firebase
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  functions = getFunctions(app);

  // Connect to emulators in development
  if (process.env.NODE_ENV === 'development') {
    // Only connect to emulators once
    if (!auth.emulatorConfig) {
      connectAuthEmulator(auth, 'http://localhost:9099');
    }
    
    if (!db._settings?.host?.includes('localhost')) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    
    if (!functions.customDomain) {
      connectFunctionsEmulator(functions, 'localhost', 5001);
    }
  }
}

export { db, auth, functions };

export default app;