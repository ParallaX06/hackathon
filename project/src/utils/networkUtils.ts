// Network utilities for low-bandwidth optimization

export interface NetworkStatus {
  isOnline: boolean;
  effectiveType: string;
  downlink: number;
  saveData: boolean;
}

// Get current network status
export function getNetworkStatus(): NetworkStatus {
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection;
  
  return {
    isOnline: navigator.onLine,
    effectiveType: connection?.effectiveType || 'unknown',
    downlink: connection?.downlink || 0,
    saveData: connection?.saveData || false
  };
}

// Check if connection is slow (for optimization)
export function isSlowConnection(): boolean {
  const status = getNetworkStatus();
  return !status.isOnline || 
         status.effectiveType === 'slow-2g' || 
         status.effectiveType === '2g' ||
         status.downlink < 1.5;
}

// Optimize update frequency based on connection
export function getOptimalUpdateInterval(): number {
  const status = getNetworkStatus();
  
  if (!status.isOnline) return 60000; // 1 minute for offline
  if (status.effectiveType === 'slow-2g' || status.effectiveType === '2g') return 30000; // 30 seconds for 2G
  if (status.effectiveType === '3g') return 15000; // 15 seconds for 3G
  return 10000; // 10 seconds for 4G/5G
}

// Compress location data for transmission
export function compressLocationData(data: any) {
  return {
    id: data.id,
    loc: [
      Math.round(data.location.lat * 1000000) / 1000000, // Reduce precision
      Math.round(data.location.lng * 1000000) / 1000000
    ],
    spd: Math.round(data.speed),
    pas: data.passengers,
    ts: data.timestamp.getTime()
  };
}

// Decompress location data
export function decompressLocationData(data: any) {
  return {
    id: data.id,
    location: {
      lat: data.loc[0],
      lng: data.loc[1]
    },
    speed: data.spd,
    passengers: data.pas,
    timestamp: new Date(data.ts)
  };
}

// Queue operations for when connection is restored
class OfflineQueue {
  private queue: Array<() => Promise<any>> = [];
  
  add(operation: () => Promise<any>) {
    this.queue.push(operation);
  }
  
  async flush() {
    const results = [];
    while (this.queue.length > 0) {
      const operation = this.queue.shift();
      if (operation) {
        try {
          const result = await operation();
          results.push(result);
        } catch (error) {
          console.error('Failed to execute queued operation:', error);
        }
      }
    }
    return results;
  }
  
  clear() {
    this.queue = [];
  }
  
  get size() {
    return this.queue.length;
  }
}

export const offlineQueue = new OfflineQueue();