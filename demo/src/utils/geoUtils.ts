// Utility functions for GPS and location calculations

export interface Location {
  lat: number;
  lng: number;
}

// Calculate distance between two GPS coordinates using Haversine formula
export function calculateDistance(point1: Location, point2: Location): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

// Calculate ETA based on distance and current speed
export function calculateETA(distance: number, speed: number): number {
  if (speed === 0) return 0;
  return Math.round((distance / speed) * 60); // Convert to minutes
}

// Get user's current location
export function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}

// Watch user's location changes
export function watchLocation(
  callback: (location: Location) => void,
  errorCallback?: (error: GeolocationPositionError) => void
): number {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported');
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    },
    errorCallback,
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }
  );
}

// Stop watching location
export function stopWatchingLocation(watchId: number): void {
  navigator.geolocation.clearWatch(watchId);
}

// Format coordinates for display
export function formatCoordinates(location: Location): string {
  return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
}

// Check if location is within a certain radius of a stop
export function isNearStop(busLocation: Location, stopLocation: Location, radiusKm: number = 0.1): boolean {
  const distance = calculateDistance(busLocation, stopLocation);
  return distance <= radiusKm;
}