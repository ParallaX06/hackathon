// Network utility functions for low-bandwidth optimization

// Check if user is on a slow connection
export const isLowBandwidth = async () => {
  // Check if Network Information API is available
  if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      // Check for slow connection types
      const slowConnections = ['slow-2g', '2g', '3g'];
      if (slowConnections.includes(connection.effectiveType)) {
        return true;
      }
      
      // Check for low download speed (less than 1 Mbps)
      if (connection.downlink && connection.downlink < 1) {
        return true;
      }
    }
  }
  
  // Fallback: measure connection speed
  try {
    const startTime = Date.now();
    const response = await fetch('/manifest.json', { cache: 'no-cache' });
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // If it takes more than 2 seconds to fetch a small file, consider it slow
    return duration > 2000;
  } catch (error) {
    console.warn('Could not determine connection speed:', error);
    return false;
  }
};

// Debounce function for limiting API calls
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Check if user is offline
export const isOnline = () => {
  return navigator.onLine;
};

// Get optimal update interval based on network conditions
export const getOptimalUpdateInterval = async () => {
  const lowBandwidth = await isLowBandwidth();
  
  if (lowBandwidth) {
    return 30000; // 30 seconds for slow connections
  }
  
  return parseInt(process.env.REACT_APP_UPDATE_INTERVAL) || 10000; // 10 seconds default
};