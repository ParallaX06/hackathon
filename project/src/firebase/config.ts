// Firebase configuration (mock for demo)
// In production, replace with actual Firebase config

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Mock Firebase config - replace with your actual Firebase project config
export const firebaseConfig: FirebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "smart-transport-sih.firebaseapp.com",
  databaseURL: "https://smart-transport-sih-default-rtdb.firebaseio.com",
  projectId: "smart-transport-sih",
  storageBucket: "smart-transport-sih.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Mock Firebase initialization
export function initializeFirebase() {
  console.log('Firebase initialized (mock mode)');
  console.log('In production, use: firebase/app, firebase/firestore, firebase/auth');
  
  // Mock Firestore connection
  return {
    db: null, // Would be initialized Firestore instance
    auth: null // Would be initialized Auth instance
  };
}

// Mock Firestore operations
export const firestoreOperations = {
  // Mock function to save bus location to Firestore
  saveBusLocation: async (busId: string, locationData: any) => {
    console.log(`Saving bus ${busId} location:`, locationData);
    // In production: await db.collection('buses').doc(busId).set(locationData, { merge: true });
  },

  // Mock function to listen to bus updates
  subscribeToBusUpdates: (callback: (buses: any[]) => void) => {
    console.log('Subscribing to bus updates');
    // In production: 
    // return db.collection('buses').onSnapshot((snapshot) => {
    //   const buses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    //   callback(buses);
    // });
    
    // Mock subscription - return unsubscribe function
    return () => console.log('Unsubscribed from bus updates');
  },

  // Mock function to calculate ETA
  calculateETA: (distance: number, speed: number) => {
    if (speed === 0) return 0;
    return Math.round(distance / (speed / 60)); // Convert km/h to minutes
  }
};