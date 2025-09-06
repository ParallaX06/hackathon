import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Bus {
  id: string;
  route: string;
  driver: string;
  location: { lat: number; lng: number };
  speed: number;
  passengers: number;
  capacity: number;
  nextStop: string;
  eta: number;
  status: 'active' | 'stopped';
}

interface TransportContextType {
  buses: Bus[];
  selectedBus: Bus | null;
  setSelectedBus: (bus: Bus | null) => void;
  updateBusLocation: (update: {
    id: string;
    location: { lat: number; lng: number };
    speed: number;
    passengers: number;
    timestamp: Date;
  }) => void;
}

const TransportContext = createContext<TransportContextType | undefined>(undefined);

export function TransportProvider({ children }: { children: ReactNode }) {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  // Mock bus data initialization
  useEffect(() => {
    const mockBuses: Bus[] = [
      {
        id: 'bus-001',
        route: 'Route 1: City Center → Airport',
        driver: 'Rajesh Kumar',
        location: { lat: 28.7041, lng: 77.1025 },
        speed: 35,
        passengers: 28,
        capacity: 50,
        nextStop: 'Metro Station',
        eta: 4,
        status: 'active'
      },
      {
        id: 'bus-002',
        route: 'Route 2: Railway Station → Mall',
        driver: 'Priya Sharma',
        location: { lat: 28.6139, lng: 77.2090 },
        speed: 42,
        passengers: 15,
        capacity: 40,
        nextStop: 'Shopping Complex',
        eta: 7,
        status: 'active'
      },
      {
        id: 'bus-003',
        route: 'Route 3: University → Bus Stand',
        driver: 'Amit Singh',
        location: { lat: 28.5244, lng: 77.1855 },
        speed: 0,
        passengers: 35,
        capacity: 45,
        nextStop: 'Traffic Signal',
        eta: 2,
        status: 'stopped'
      }
    ];
    setBuses(mockBuses);
  }, []);

  const updateBusLocation = (update: {
    id: string;
    location: { lat: number; lng: number };
    speed: number;
    passengers: number;
    timestamp: Date;
  }) => {
    setBuses(prevBuses => 
      prevBuses.map(bus => 
        bus.id === update.id
          ? {
              ...bus,
              location: update.location,
              speed: update.speed,
              passengers: update.passengers,
              status: update.speed > 0 ? 'active' as const : 'stopped' as const,
              // Simple ETA calculation: assume 2km distance and current speed
              eta: update.speed > 0 ? Math.round(2 / (update.speed / 60)) : 0
            }
          : bus
      )
    );
  };

  return (
    <TransportContext.Provider value={{
      buses,
      selectedBus,
      setSelectedBus,
      updateBusLocation
    }}>
      {children}
    </TransportContext.Provider>
  );
}

export function useTransport() {
  const context = useContext(TransportContext);
  if (context === undefined) {
    throw new Error('useTransport must be used within a TransportProvider');
  }
  return context;
}