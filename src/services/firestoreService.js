// Firestore service layer for managing bus data
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';

// Collection references
export const COLLECTIONS = {
  BUSES: 'buses',
  ROUTES: 'routes',
  BUS_STOPS: 'busStops',
  ETAS: 'etas',
  USERS: 'users'
};

// Real-time subscription for active buses
export const subscribeToActiveBuses = (callback) => {
  const q = query(
    collection(db, COLLECTIONS.BUSES),
    where('isActive', '==', true),
    orderBy('lastUpdated', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const buses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(buses);
  });
};

// Subscribe to buses for a specific route
export const subscribeToBusesByRoute = (routeId, callback) => {
  const q = query(
    collection(db, COLLECTIONS.BUSES),
    where('routeId', '==', routeId),
    where('isActive', '==', true),
    orderBy('lastUpdated', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const buses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(buses);
  });
};

// Update bus location (called by driver app)
export const updateBusLocation = async (busId, locationData) => {
  try {
    const busRef = doc(db, COLLECTIONS.BUSES, busId);
    await updateDoc(busRef, {
      ...locationData,
      lastUpdated: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating bus location:', error);
    return { success: false, error: error.message };
  }
};

// Create a new bus entry
export const createBus = async (busData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.BUSES), {
      ...busData,
      isActive: true,
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating bus:', error);
    return { success: false, error: error.message };
  }
};

// Get all routes
export const getRoutes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.ROUTES));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching routes:', error);
    return [];
  }
};

// Get bus stops for a route
export const getBusStopsForRoute = async (routeId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.BUS_STOPS),
      where('routeId', '==', routeId),
      orderBy('sequence', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching bus stops:', error);
    return [];
  }
};

// Subscribe to ETAs for a specific bus stop
export const subscribeToETAs = (busStopId, callback) => {
  const q = query(
    collection(db, COLLECTIONS.ETAS),
    where('busStopId', '==', busStopId),
    orderBy('estimatedArrival', 'asc'),
    limit(5)
  );

  return onSnapshot(q, (snapshot) => {
    const etas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(etas);
  });
};

// Calculate and update ETA
export const updateETA = async (busId, busStopId, eta) => {
  try {
    await addDoc(collection(db, COLLECTIONS.ETAS), {
      busId,
      busStopId,
      estimatedArrival: eta,
      calculatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating ETA:', error);
    return { success: false, error: error.message };
  }
};