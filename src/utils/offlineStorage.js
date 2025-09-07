// Offline storage and sync utilities for low bandwidth scenarios
import { openDB } from 'idb';

const DB_NAME = 'TransportTrackerDB';
const DB_VERSION = 1;

// Initialize IndexedDB
export const initDB = async () => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Store for offline location updates
        if (!db.objectStoreNames.contains('locationUpdates')) {
          const locationStore = db.createObjectStore('locationUpdates', {
            keyPath: 'id',
            autoIncrement: true
          });
          locationStore.createIndex('timestamp', 'timestamp');
          locationStore.createIndex('busId', 'busId');
        }

        // Store for cached bus data
        if (!db.objectStoreNames.contains('busCache')) {
          const busStore = db.createObjectStore('busCache', {
            keyPath: 'id'
          });
          busStore.createIndex('routeId', 'routeId');
          busStore.createIndex('lastUpdated', 'lastUpdated');
        }

        // Store for cached route data
        if (!db.objectStoreNames.contains('routeCache')) {
          db.createObjectStore('routeCache', {
            keyPath: 'id'
          });
        }
      }
    });
    return db;
  } catch (error) {
    console.error('Error initializing IndexedDB:', error);
    return null;
  }
};

// Store location update offline
export const storeLocationUpdateOffline = async (busId, locationData) => {
  try {
    const db = await initDB();
    if (!db) return false;

    await db.add('locationUpdates', {
      busId,
      locationData,
      timestamp: Date.now(),
      synced: false
    });

    return true;
  } catch (error) {
    console.error('Error storing location update offline:', error);
    return false;
  }
};

// Get pending offline location updates
export const getOfflineLocationUpdates = async () => {
  try {
    const db = await initDB();
    if (!db) return [];

    const updates = await db.getAllFromIndex('locationUpdates', 'synced', false);
    return updates;
  } catch (error) {
    console.error('Error getting offline location updates:', error);
    return [];
  }
};

// Mark location update as synced
export const markLocationUpdateSynced = async (id) => {
  try {
    const db = await initDB();
    if (!db) return false;

    await db.delete('locationUpdates', id);
    return true;
  } catch (error) {
    console.error('Error marking location update as synced:', error);
    return false;
  }
};

// Cache bus data for offline access
export const cacheBusData = async (buses) => {
  try {
    const db = await initDB();
    if (!db) return false;

    const tx = db.transaction('busCache', 'readwrite');
    const store = tx.objectStore('busCache');

    // Clear old data
    await store.clear();

    // Store new data
    for (const bus of buses) {
      await store.add({
        ...bus,
        cachedAt: Date.now()
      });
    }

    await tx.done;
    return true;
  } catch (error) {
    console.error('Error caching bus data:', error);
    return false;
  }
};

// Get cached bus data
export const getCachedBusData = async (routeId = null) => {
  try {
    const db = await initDB();
    if (!db) return [];

    let buses;
    if (routeId) {
      buses = await db.getAllFromIndex('busCache', 'routeId', routeId);
    } else {
      buses = await db.getAll('busCache');
    }

    // Filter out data older than 10 minutes
    const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
    return buses.filter(bus => bus.cachedAt > tenMinutesAgo);
  } catch (error) {
    console.error('Error getting cached bus data:', error);
    return [];
  }
};

// Cache route data
export const cacheRouteData = async (routes) => {
  try {
    const db = await initDB();
    if (!db) return false;

    const tx = db.transaction('routeCache', 'readwrite');
    const store = tx.objectStore('routeCache');

    await store.clear();
    for (const route of routes) {
      await store.add({
        ...route,
        cachedAt: Date.now()
      });
    }

    await tx.done;
    return true;
  } catch (error) {
    console.error('Error caching route data:', error);
    return false;
  }
};

// Get cached route data
export const getCachedRouteData = async () => {
  try {
    const db = await initDB();
    if (!db) return [];

    const routes = await db.getAll('routeCache');
    
    // Filter out data older than 1 hour
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    return routes.filter(route => route.cachedAt > oneHourAgo);
  } catch (error) {
    console.error('Error getting cached route data:', error);
    return [];
  }
};

// Clean up old cached data
export const cleanupOldCache = async () => {
  try {
    const db = await initDB();
    if (!db) return;

    const oneHourAgo = Date.now() - (60 * 60 * 1000);

    // Clean bus cache
    const busTx = db.transaction('busCache', 'readwrite');
    const busStore = busTx.objectStore('busCache');
    const busCursor = await busStore.openCursor();
    
    while (busCursor) {
      if (busCursor.value.cachedAt < oneHourAgo) {
        await busCursor.delete();
      }
      await busCursor.continue();
    }

    // Clean location updates older than 24 hours
    const locationTx = db.transaction('locationUpdates', 'readwrite');
    const locationStore = locationTx.objectStore('locationUpdates');
    const locationCursor = await locationStore.openCursor();
    
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    while (locationCursor) {
      if (locationCursor.value.timestamp < twentyFourHoursAgo) {
        await locationCursor.delete();
      }
      await locationCursor.continue();
    }

  } catch (error) {
    console.error('Error cleaning up old cache:', error);
  }
};