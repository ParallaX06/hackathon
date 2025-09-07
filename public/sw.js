// Service Worker for offline caching and low bandwidth optimization
const CACHE_NAME = 'transport-tracker-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Cache API responses for offline functionality
const API_CACHE_URLS = [
  '/api/buses',
  '/api/routes',
  '/api/bus-stops'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .catch((error) => {
        console.error('Error caching static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/') || url.hostname.includes('firestore')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Return cached version if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Handle static assets with cache-first strategy
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response.ok) {
              return response;
            }

            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });

            return response;
          });
      })
  );
});

// Background sync for offline location updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-location-sync') {
    event.waitUntil(
      syncOfflineLocationUpdates()
    );
  }
});

// Function to sync offline location updates
async function syncOfflineLocationUpdates() {
  try {
    // Get offline location updates from IndexedDB
    const offlineUpdates = await getOfflineLocationUpdates();
    
    for (const update of offlineUpdates) {
      try {
        await fetch('/api/update-bus-location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(update)
        });
        
        // Remove successfully synced update
        await removeOfflineLocationUpdate(update.id);
      } catch (error) {
        console.error('Failed to sync location update:', error);
      }
    }
  } catch (error) {
    console.error('Error syncing offline updates:', error);
  }
}

// Placeholder functions for IndexedDB operations
async function getOfflineLocationUpdates() {
  // Implementation would use IndexedDB to store offline updates
  return [];
}

async function removeOfflineLocationUpdate(id) {
  // Implementation would remove synced update from IndexedDB
}