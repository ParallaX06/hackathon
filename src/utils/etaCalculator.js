// ETA calculation utilities

// Calculate distance between two points using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
};

// Convert degrees to radians
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

// Calculate ETA based on distance and average speed
export const calculateETA = (busLocation, stopLocation, averageSpeed = 25) => {
  const distance = calculateDistance(
    busLocation.latitude,
    busLocation.longitude,
    stopLocation.latitude,
    stopLocation.longitude
  );
  
  // Convert distance to meters for more accurate calculation
  const distanceInMeters = distance * 1000;
  
  // Calculate time in minutes (speed is in km/h)
  const timeInHours = distance / averageSpeed;
  const timeInMinutes = Math.round(timeInHours * 60);
  
  // Add current time to get ETA
  const eta = new Date();
  eta.setMinutes(eta.getMinutes() + timeInMinutes);
  
  return {
    eta,
    distanceKm: distance,
    distanceMeters: distanceInMeters,
    estimatedMinutes: timeInMinutes
  };
};

// Format ETA for display
export const formatETA = (eta) => {
  if (!eta) return 'Unknown';
  
  const now = new Date();
  const etaDate = eta instanceof Date ? eta : new Date(eta);
  const diffMinutes = Math.round((etaDate - now) / 60000);
  
  if (diffMinutes < 1) return 'Arriving now';
  if (diffMinutes < 60) return `${diffMinutes} min`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m`;
  
  return etaDate.toLocaleTimeString();
};

// Calculate average speed based on recent location updates
export const calculateAverageSpeed = (locationHistory) => {
  if (!locationHistory || locationHistory.length < 2) {
    return 25; // Default speed in km/h
  }
  
  let totalDistance = 0;
  let totalTime = 0;
  
  for (let i = 1; i < locationHistory.length; i++) {
    const prev = locationHistory[i - 1];
    const curr = locationHistory[i];
    
    const distance = calculateDistance(
      prev.location.latitude,
      prev.location.longitude,
      curr.location.latitude,
      curr.location.longitude
    );
    
    const timeDiff = (curr.timestamp - prev.timestamp) / (1000 * 60 * 60); // hours
    
    if (timeDiff > 0) {
      totalDistance += distance;
      totalTime += timeDiff;
    }
  }
  
  if (totalTime === 0) return 25;
  
  const averageSpeed = totalDistance / totalTime;
  
  // Clamp speed between reasonable values for city buses
  return Math.max(5, Math.min(60, averageSpeed));
};