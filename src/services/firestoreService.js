// Enhanced Firestore service with market-ready functionality
import { db, isDemoMode } from './firebase';
import { 
  collection, 
  doc, 
  updateDoc, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  query, 
  where,
  orderBy,
  limit,
  getDocs,
  setDoc
} from 'firebase/firestore';

// Bus Management Functions
export const updateBusLocation = async (busId, locationData) => {
  if (isDemoMode) {
    // Enhanced demo mode with in-memory updates
    const busData = db.mockData.buses.get(busId);
    if (busData) {
      const updatedBus = {
        ...busData,
        ...locationData,
        lastUpdated: new Date()
      };
      db.mockData.buses.set(busId, updatedBus);
      console.log(`📍 Demo: Updated bus ${busId} location:`, locationData);
    }
    return Promise.resolve();
  }
  
  try {
    await updateDoc(doc(db, 'buses', busId), {
      ...locationData,
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating bus location:', error);
    throw error;
  }
};

export const subscribeToActiveBuses = (callback) => {
  if (isDemoMode) {
    // Enhanced demo subscription with real-time simulation
    const updateInterval = setInterval(() => {
      const buses = Array.from(db.mockData.buses.values());
      // Simulate bus movement
      buses.forEach(bus => {
        if (bus.isActive) {
          bus.speed = Math.max(5, Math.min(60, bus.speed + (Math.random() - 0.5) * 10));
          bus.location = {
            latitude: bus.location.latitude + (Math.random() - 0.5) * 0.0005,
            longitude: bus.location.longitude + (Math.random() - 0.5) * 0.0005
          };
          bus.lastUpdated = new Date();
        }
      });
      callback(buses);
    }, 3000);
    
    // Initial call
    callback(Array.from(db.mockData.buses.values()));
    
    return () => clearInterval(updateInterval);
  }
  
  const q = query(collection(db, 'buses'), where('isActive', '==', true));
  return onSnapshot(q, (snapshot) => {
    const buses = [];
    snapshot.forEach((doc) => {
      buses.push({ id: doc.id, ...doc.data() });
    });
    callback(buses);
  });
};

export const getAllBuses = async () => {
  if (isDemoMode) {
    return Array.from(db.mockData.buses.values());
  }
  
  try {
    const querySnapshot = await getDocs(collection(db, 'buses'));
    const buses = [];
    querySnapshot.forEach((doc) => {
      buses.push({ id: doc.id, ...doc.data() });
    });
    return buses;
  } catch (error) {
    console.error('Error getting buses:', error);
    throw error;
  }
};

// Route Management Functions
export const getRoutes = async () => {
  if (isDemoMode) {
    return Array.from(db.mockData.routes.values());
  }
  
  try {
    const querySnapshot = await getDocs(collection(db, 'routes'));
    const routes = [];
    querySnapshot.forEach((doc) => {
      routes.push({ id: doc.id, ...doc.data() });
    });
    return routes;
  } catch (error) {
    console.error('Error getting routes:', error);
    throw error;
  }
};

export const createRoute = async (routeData) => {
  if (isDemoMode) {
    const id = 'route-' + Date.now();
    const route = { ...routeData, id, createdAt: new Date() };
    db.mockData.routes.set(id, route);
    return { id };
  }
  
  try {
    return await addDoc(collection(db, 'routes'), {
      ...routeData,
      createdAt: serverTimestamp(),
      isActive: true
    });
  } catch (error) {
    console.error('Error creating route:', error);
    throw error;
  }
};

// Driver Management Functions
export const startLocationSharing = async (driverId, busId) => {
  if (isDemoMode) {
    const bus = db.mockData.buses.get(busId);
    if (bus) {
      bus.driverId = driverId;
      bus.isActive = true;
      bus.locationSharing = true;
      db.mockData.buses.set(busId, bus);
    }
    return Promise.resolve();
  }
  
  try {
    await updateDoc(doc(db, 'buses', busId), {
      driverId,
      isActive: true,
      locationSharing: true,
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error('Error starting location sharing:', error);
    throw error;
  }
};

export const stopLocationSharing = async (busId) => {
  if (isDemoMode) {
    const bus = db.mockData.buses.get(busId);
    if (bus) {
      bus.isActive = false;
      bus.locationSharing = false;
      db.mockData.buses.set(busId, bus);
    }
    return Promise.resolve();
  }
  
  try {
    await updateDoc(doc(db, 'buses', busId), {
      isActive: false,
      locationSharing: false,
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error('Error stopping location sharing:', error);
    throw error;
  }
};

// Notification Functions
export const sendDriverNotification = async (driverId, message, type = 'info') => {
  if (isDemoMode) {
    const id = 'notification-' + Date.now();
    const notification = {
      id,
      driverId,
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    db.mockData.notifications.set(id, notification);
    console.log('📱 Demo notification sent:', notification);
    return Promise.resolve();
  }
  
  try {
    await addDoc(collection(db, 'notifications'), {
      driverId,
      message,
      type,
      timestamp: serverTimestamp(),
      read: false
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

// Analytics Functions
export const getBusAnalytics = async (timeRange = '24h') => {
  if (isDemoMode) {
    // Generate demo analytics
    const buses = Array.from(db.mockData.buses.values());
    const activeBuses = buses.filter(bus => bus.isActive);
    
    return {
      totalBuses: buses.length,
      activeBuses: activeBuses.length,
      averageSpeed: activeBuses.reduce((sum, bus) => sum + bus.speed, 0) / activeBuses.length || 0,
      totalRoutes: db.mockData.routes.size,
      onTimePerformance: 85.4,
      passengerCount: activeBuses.reduce((sum, bus) => sum + (bus.currentPassengers || 0), 0)
    };
  }
  
  // Real analytics implementation would go here
  return {
    totalBuses: 0,
    activeBuses: 0,
    averageSpeed: 0,
    totalRoutes: 0,
    onTimePerformance: 0,
    passengerCount: 0
  };
};

// Route Status Management
export const updateRouteStatus = async (busId, status) => {
  if (isDemoMode) {
    const bus = db.mockData.buses.get(busId);
    if (bus) {
      bus.routeStatus = status;
      bus.lastUpdated = new Date();
      db.mockData.buses.set(busId, bus);
    }
    return Promise.resolve();
  }
  
  try {
    await updateDoc(doc(db, 'buses', busId), {
      routeStatus: status,
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating route status:', error);
    throw error;
  }
};

// Real-time Bus Tracking
export const subscribeToBus = (busId, callback) => {
  if (isDemoMode) {
    const updateInterval = setInterval(() => {
      const bus = db.mockData.buses.get(busId);
      if (bus) {
        callback(bus);
      }
    }, 2000);
    
    return () => clearInterval(updateInterval);
  }
  
  return onSnapshot(doc(db, 'buses', busId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    }
  });
};