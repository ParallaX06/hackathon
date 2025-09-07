// Bus movement simulation for testing purposes
import { db } from '../services/firebase';
import { updateBusLocation, createBus } from '../services/firestoreService';
import { calculateETA } from './etaCalculator';

// Predefined routes for simulation (example for a city)
export const DEMO_ROUTES = [
  {
    id: 'route-1',
    name: 'City Center to Airport',
    routeNumber: '101',
    stops: [
      { id: 'stop-1', name: 'City Center', location: { latitude: 28.6139, longitude: 77.2090 }, sequence: 1 },
      { id: 'stop-2', name: 'Mall Junction', location: { latitude: 28.6169, longitude: 77.2155 }, sequence: 2 },
      { id: 'stop-3', name: 'University Gate', location: { latitude: 28.6199, longitude: 77.2220 }, sequence: 3 },
      { id: 'stop-4', name: 'Metro Station', location: { latitude: 28.6229, longitude: 77.2285 }, sequence: 4 },
      { id: 'stop-5', name: 'Airport Terminal', location: { latitude: 28.6259, longitude: 77.2350 }, sequence: 5 }
    ]
  },
  {
    id: 'route-2',
    name: 'North to South Line',
    routeNumber: '102',
    stops: [
      { id: 'stop-6', name: 'North Station', location: { latitude: 28.6200, longitude: 77.2090 }, sequence: 1 },
      { id: 'stop-7', name: 'Central Park', location: { latitude: 28.6150, longitude: 77.2090 }, sequence: 2 },
      { id: 'stop-8', name: 'Market Square', location: { latitude: 28.6100, longitude: 77.2090 }, sequence: 3 },
      { id: 'stop-9', name: 'Hospital', location: { latitude: 28.6050, longitude: 77.2090 }, sequence: 4 },
      { id: 'stop-10', name: 'South Terminal', location: { latitude: 28.6000, longitude: 77.2090 }, sequence: 5 }
    ]
  }
];

// Demo buses configuration
export const DEMO_BUSES = [
  {
    id: 'bus-101-1',
    routeId: 'route-1',
    routeNumber: '101',
    routeName: 'City Center to Airport',
    speed: 25, // km/h
    currentStopIndex: 0
  },
  {
    id: 'bus-101-2',
    routeId: 'route-1',
    routeNumber: '101',
    routeName: 'City Center to Airport',
    speed: 30,
    currentStopIndex: 2
  },
  {
    id: 'bus-102-1',
    routeId: 'route-2',
    routeNumber: '102',
    routeName: 'North to South Line',
    speed: 20,
    currentStopIndex: 1
  }
];

class BusSimulator {
  constructor() {
    this.simulationRunning = false;
    this.intervalId = null;
    this.buses = new Map();
  }

  // Initialize demo data
  async initializeDemoData() {
    console.log('Initializing demo data...');
    
    try {
      // Create demo buses
      for (const busConfig of DEMO_BUSES) {
        const route = DEMO_ROUTES.find(r => r.id === busConfig.routeId);
        if (!route) continue;

        const initialStop = route.stops[busConfig.currentStopIndex];
        const bus = {
          ...busConfig,
          location: {
            latitude: initialStop.location.latitude + (Math.random() - 0.5) * 0.001,
            longitude: initialStop.location.longitude + (Math.random() - 0.5) * 0.001
          },
          targetStopIndex: (busConfig.currentStopIndex + 1) % route.stops.length,
          progress: 0, // Progress to next stop (0-1)
          isActive: true,
          driverId: `driver-${busConfig.id}`,
          lastUpdated: new Date()
        };

        this.buses.set(busConfig.id, bus);
        
        // Create in Firestore
        await createBus(bus);
      }

      console.log('Demo data initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing demo data:', error);
      return false;
    }
  }

  // Start simulation
  async startSimulation() {
    if (this.simulationRunning) {
      console.log('Simulation already running');
      return;
    }

    console.log('Starting bus simulation...');
    this.simulationRunning = true;

    // Initialize demo data if buses map is empty
    if (this.buses.size === 0) {
      await this.initializeDemoData();
    }

    // Update every 10 seconds
    this.intervalId = setInterval(() => {
      this.updateAllBuses();
    }, 10000);

    // Do initial update
    this.updateAllBuses();
  }

  // Stop simulation
  stopSimulation() {
    if (!this.simulationRunning) {
      console.log('Simulation not running');
      return;
    }

    console.log('Stopping bus simulation...');
    this.simulationRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Mark all buses as inactive
    this.buses.forEach(async (bus) => {
      await updateBusLocation(bus.id, { isActive: false });
    });
  }

  // Update all buses
  async updateAllBuses() {
    for (const [busId, bus] of this.buses) {
      await this.updateBusPosition(busId, bus);
    }
  }

  // Update individual bus position
  async updateBusPosition(busId, bus) {
    try {
      const route = DEMO_ROUTES.find(r => r.id === bus.routeId);
      if (!route) return;

      const currentStop = route.stops[bus.currentStopIndex];
      const targetStop = route.stops[bus.targetStopIndex];

      // Calculate movement progress (0.1 = 10% closer to target)
      const movementSpeed = 0.1; // Adjust this to make buses move faster/slower
      bus.progress += movementSpeed;

      let newLocation;

      if (bus.progress >= 1) {
        // Reached target stop
        bus.currentStopIndex = bus.targetStopIndex;
        bus.targetStopIndex = (bus.targetStopIndex + 1) % route.stops.length;
        bus.progress = 0;
        newLocation = targetStop.location;
      } else {
        // Interpolate between current and target stop
        newLocation = {
          latitude: currentStop.location.latitude + 
            (targetStop.location.latitude - currentStop.location.latitude) * bus.progress,
          longitude: currentStop.location.longitude + 
            (targetStop.location.longitude - currentStop.location.longitude) * bus.progress
        };
      }

      // Add some randomness to make movement more realistic
      newLocation.latitude += (Math.random() - 0.5) * 0.0001;
      newLocation.longitude += (Math.random() - 0.5) * 0.0001;

      // Update bus location
      bus.location = newLocation;
      bus.lastUpdated = new Date();

      // Determine next stop
      const nextStopIndex = (bus.currentStopIndex + 1) % route.stops.length;
      const nextStop = route.stops[nextStopIndex];

      // Update in Firestore
      await updateBusLocation(busId, {
        location: newLocation,
        speed: bus.speed + (Math.random() - 0.5) * 5, // Add speed variation
        routeNumber: bus.routeNumber,
        routeName: bus.routeName,
        routeId: bus.routeId,
        currentStop: currentStop.name,
        nextStop: nextStop.name,
        isActive: true
      });

      // Calculate and update ETAs for upcoming stops
      await this.updateETAsForBus(bus, route);

    } catch (error) {
      console.error(`Error updating bus ${busId}:`, error);
    }
  }

  // Calculate ETAs for upcoming stops
  async updateETAsForBus(bus, route) {
    try {
      // Calculate ETA for next 3 stops
      for (let i = 1; i <= 3; i++) {
        const stopIndex = (bus.currentStopIndex + i) % route.stops.length;
        const stop = route.stops[stopIndex];
        
        const etaData = calculateETA(bus.location, stop.location, bus.speed);
        
        // Here you would save to the ETAs collection
        // This is a simplified version - in real implementation, 
        // you'd save to Firestore's etas collection
        console.log(`ETA for bus ${bus.id} to ${stop.name}: ${etaData.estimatedMinutes} minutes`);
      }
    } catch (error) {
      console.error('Error calculating ETAs:', error);
    }
  }

  // Get current simulation status
  getStatus() {
    return {
      running: this.simulationRunning,
      busCount: this.buses.size,
      lastUpdate: new Date()
    };
  }
}

// Export singleton instance
export const busSimulator = new BusSimulator();

// Utility function to start simulation (can be called from UI)
export const startBusSimulation = () => {
  return busSimulator.startSimulation();
};

// Utility function to stop simulation
export const stopBusSimulation = () => {
  return busSimulator.stopSimulation();
};

// Utility function to get simulation status
export const getSimulationStatus = () => {
  return busSimulator.getStatus();
};