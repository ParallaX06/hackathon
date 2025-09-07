import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

// Calculate ETA when bus location is updated
export const calculateETAOnLocationUpdate = functions.firestore
  .document('buses/{busId}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const busId = context.params.busId;

    if (!newValue || !newValue.location || !newValue.isActive) {
      return null;
    }

    try {
      // Get route information
      const routeDoc = await db.collection('routes').doc(newValue.routeId).get();
      if (!routeDoc.exists) {
        console.log('Route not found:', newValue.routeId);
        return null;
      }

      const route = routeDoc.data();
      
      // Get bus stops for this route
      const busStopsQuery = await db.collection('busStops')
        .where('routeId', '==', newValue.routeId)
        .orderBy('sequence')
        .get();

      const busStops = busStopsQuery.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate ETAs for upcoming stops
      const etaPromises = busStops.map(async (stop) => {
        const distance = calculateDistance(
          newValue.location.latitude,
          newValue.location.longitude,
          stop.location.latitude,
          stop.location.longitude
        );

        const speed = newValue.speed || 25; // Default speed in km/h
        const timeInHours = distance / speed;
        const timeInMinutes = timeInHours * 60;

        const eta = new Date();
        eta.setMinutes(eta.getMinutes() + timeInMinutes);

        // Save ETA to database
        await db.collection('etas').add({
          busId,
          busStopId: stop.id,
          routeId: newValue.routeId,
          estimatedArrival: eta,
          distance: distance,
          calculatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return {
          stopId: stop.id,
          stopName: stop.name,
          eta,
          distance,
          estimatedMinutes: Math.round(timeInMinutes)
        };
      });

      await Promise.all(etaPromises);
      
      console.log(`ETAs calculated for bus ${busId}`);
      return null;

    } catch (error) {
      console.error('Error calculating ETAs:', error);
      return null;
    }
  });

// Clean up old ETAs (run every hour)
export const cleanupOldETAs = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - 2); // Delete ETAs older than 2 hours

    try {
      const oldETAsQuery = await db.collection('etas')
        .where('calculatedAt', '<', cutoffTime)
        .get();

      const batch = db.batch();
      oldETAsQuery.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`Cleaned up ${oldETAsQuery.docs.length} old ETAs`);
      
    } catch (error) {
      console.error('Error cleaning up old ETAs:', error);
    }

    return null;
  });

// Mark buses as inactive if they haven't updated in 5 minutes
export const markInactiveBuses = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    const cutoffTime = new Date();
    cutoffTime.setMinutes(cutoffTime.getMinutes() - 5);

    try {
      const staleBusesQuery = await db.collection('buses')
        .where('isActive', '==', true)
        .where('lastUpdated', '<', cutoffTime)
        .get();

      const batch = db.batch();
      staleBusesQuery.docs.forEach((doc) => {
        batch.update(doc.ref, { 
          isActive: false,
          lastSeen: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      await batch.commit();
      console.log(`Marked ${staleBusesQuery.docs.length} buses as inactive`);
      
    } catch (error) {
      console.error('Error marking inactive buses:', error);
    }

    return null;
  });

// HTTP endpoint to get live bus data (for external integrations)
export const getLiveBusData = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const routeId = req.query.routeId as string;
    
    let query = db.collection('buses')
      .where('isActive', '==', true)
      .orderBy('lastUpdated', 'desc');

    if (routeId) {
      query = query.where('routeId', '==', routeId);
    }

    const busesSnapshot = await query.get();
    const buses = busesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      count: buses.length,
      data: buses,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting live bus data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// HTTP endpoint to get ETAs for a specific bus stop
export const getETAsForStop = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const busStopId = req.query.busStopId as string;
    
    if (!busStopId) {
      res.status(400).json({
        success: false,
        error: 'busStopId parameter is required'
      });
      return;
    }

    const etasSnapshot = await db.collection('etas')
      .where('busStopId', '==', busStopId)
      .where('estimatedArrival', '>', new Date())
      .orderBy('estimatedArrival')
      .limit(5)
      .get();

    const etas = etasSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      busStopId,
      count: etas.length,
      data: etas,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting ETAs:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Utility function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}