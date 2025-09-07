import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [isOpenStreetMapEnabled, setIsOpenStreetMapEnabled] = useState(true);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [isLocationSharing, setIsLocationSharing] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [driverRouteStatus, setDriverRouteStatus] = useState('on-route');
  const [buses, setBuses] = useState([
    {
      id: 'bus-001',
      routeNumber: '42A',
      routeName: 'City Center - Airport',
      routeId: 'route-1',
      isActive: true,
      speed: 35,
      location: { latitude: 28.6139, longitude: 77.2090 },
      lastUpdated: new Date(),
      nextStop: 'Central Station'
    },
    {
      id: 'bus-002',
      routeNumber: '15B',
      routeName: 'Mall - University',
      routeId: 'route-2',
      isActive: true,
      speed: 28,
      location: { latitude: 28.6169, longitude: 77.2120 },
      lastUpdated: new Date(),
      nextStop: 'Shopping Complex'
    },
    {
      id: 'bus-003',
      routeNumber: '8C',
      routeName: 'Hospital - Stadium',
      routeId: 'route-3',
      isActive: true,
      speed: 42,
      location: { latitude: 28.6109, longitude: 77.2060 },
      lastUpdated: new Date(),
      nextStop: 'Medical College'
    }
  ]);

  // Simulate real-time bus updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prevBuses => 
        prevBuses.map(bus => ({
          ...bus,
          speed: Math.max(5, Math.min(60, bus.speed + (Math.random() - 0.5) * 10)),
          location: {
            latitude: bus.location.latitude + (Math.random() - 0.5) * 0.0005,
            longitude: bus.location.longitude + (Math.random() - 0.5) * 0.0005
          },
          lastUpdated: new Date()
        }))
      );
    }, 3000); // Update every 3 seconds for real-time feel
    
    return () => clearInterval(interval);
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setIsLocationSharing(true);
        },
        (error) => {
          console.warn('Geolocation error:', error);
        }
      );
    }
  }, []);

  // Default map center (New Delhi coordinates)
  const mapCenter = userLocation ? [userLocation.latitude, userLocation.longitude] : [28.6139, 77.2090];

  // Custom bus icon for Leaflet
  const createBusIcon = (bus) => {
    const iconHtml = `
      <div style="
        background: ${bus.isActive ? '#4CAF50' : '#F44336'};
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        🚌
      </div>
    `;
    
    return new L.DivIcon({
      html: iconHtml,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
      className: 'custom-bus-icon'
    });
  };

  useEffect(() => {
    // Fix for default markers in react-leaflet
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  return (
    <Router>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        {/* Header */}
        <header style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          padding: '15px 20px',
          color: 'white',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>🚌</div>
              <h1 style={{ 
                fontSize: '1.5rem', 
                margin: '0',
                fontWeight: '600'
              }}>
                TransitTracker
              </h1>
              <span style={{
                background: 'rgba(76, 175, 80, 0.2)',
                color: '#4CAF50',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                border: '1px solid rgba(76, 175, 80, 0.3)'
              }}>LIVE</span>
            </div>
            
            {/* Navigation */}
            <nav style={{ 
              display: 'flex', 
              gap: '8px',
              alignItems: 'center'
            }}>
              <Link to="/" style={{
                color: window.location.pathname === '/' ? 'white' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                background: window.location.pathname === '/' ? 'rgba(255,255,255,0.2)' : 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                🏠 Passenger
              </Link>
              <Link to="/driver" style={{
                color: window.location.pathname === '/driver' ? 'white' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                background: window.location.pathname === '/driver' ? 'rgba(255,255,255,0.2)' : 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                🚗 Driver
              </Link>
              <Link to="/admin" style={{
                color: window.location.pathname === '/admin' ? 'white' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                background: window.location.pathname === '/admin' ? 'rgba(255,255,255,0.2)' : 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                👨‍💼 Admin
              </Link>
              
              {/* Status Indicators */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginLeft: '16px',
                paddingLeft: '16px',
                borderLeft: '1px solid rgba(255,255,255,0.2)'
              }}>
                {/* Live Status */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#4CAF50',
                    animation: 'pulse 2s infinite'
                  }}></div>
                  <span style={{ fontSize: '12px', opacity: '0.8' }}>Live</span>
                </div>
                
                {/* Bus Count */}
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {buses.length} Buses
                </div>
                
                {/* Notification Bell */}
                <div style={{
                  position: 'relative',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                }}
                >
                  🔔
                  <div style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#ff4757'
                  }}></div>
                </div>
              </div>
            </nav>
          </div>
        </header>

        <Routes>
          {/* Passenger View */}
          <Route path="/" element={
            <main style={{ 
              height: 'calc(100vh - 120px)',
              display: 'flex',
              background: '#1a1a2e'
            }}>
              {/* Left Side - Map Container */}
              <div style={{
                flex: '2',
                position: 'relative',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '0 0 0 20px'
              }}>
                {/* Map Search Bar */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  right: '20px',
                  zIndex: 1000
                }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: '25px',
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Search for a route or stop"
                      style={{
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        flex: 1,
                        fontSize: '16px',
                        color: '#333'
                      }}
                    />
                  </div>
                </div>

                {/* OpenStreetMap Information Area */}
                <div style={{
                  position: 'absolute',
                  top: '80px',
                  left: '20px',
                  background: 'rgba(76, 175, 80, 0.9)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  zIndex: 1000,
                  color: 'white'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div>✅</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>OpenStreetMap Active</div>
                      <div style={{ fontSize: '12px', opacity: '0.8' }}>Free & Open Source Maps</div>
                    </div>
                  </div>
                </div>

                {/* OpenStreetMap Container */}
                <div style={{
                  position: 'absolute',
                  top: '150px',
                  left: '20px',
                  right: '20px',
                  bottom: '20px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.2)',
                  zIndex: 1
                }}>
                  <MapContainer 
                    center={mapCenter} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Bus Markers */}
                    {buses.map((bus) => (
                      <Marker 
                        key={bus.id}
                        position={[bus.location.latitude, bus.location.longitude]}
                        icon={createBusIcon(bus)}
                        eventHandlers={{
                          click: () => {
                            setSelectedBusId(bus.id);
                          }
                        }}
                      >
                        <Popup>
                          <div style={{ minWidth: '200px' }}>
                            <h4 style={{ margin: '0 0 8px 0' }}>🚌 Bus {bus.routeNumber}</h4>
                            <p style={{ margin: '4px 0' }}><strong>Route:</strong> {bus.routeName}</p>
                            <p style={{ margin: '4px 0' }}><strong>Status:</strong> {bus.isActive ? '✅ Active' : '❌ Inactive'}</p>
                            <p style={{ margin: '4px 0' }}><strong>Speed:</strong> {Math.round(bus.speed)} km/h</p>
                            <p style={{ margin: '4px 0' }}><strong>Next Stop:</strong> {bus.nextStop}</p>
                            <button
                              onClick={() => setSelectedBusId(bus.id)}
                              style={{
                                background: '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                marginTop: '8px'
                              }}
                            >
                              Select Bus
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>

                {/* Map Controls */}
                <div style={{
                  position: 'absolute',
                  right: '30px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <button style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>+</button>
                  <button style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>−</button>
                </div>
              </div>

              {/* Right Side - Bus Information Panel */}
              <div style={{
                flex: '1',
                background: '#16213e',
                color: 'white',
                padding: '30px',
                minWidth: '350px',
                maxWidth: '400px',
                borderRadius: '0 0 20px 0',
                overflowY: 'auto'
              }}>
                <h2 style={{
                  margin: '0 0 20px 0',
                  fontSize: '24px',
                  fontWeight: '600'
                }}>Bus Information</h2>
                <p style={{
                  margin: '0 0 30px 0',
                  opacity: '0.7',
                  fontSize: '14px'
                }}>Real-time bus tracking and details.</p>

                {/* Location Status */}
                <div style={{
                  background: isLocationSharing ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                  border: `1px solid ${isLocationSharing ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 152, 0, 0.3)'}`,
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: isLocationSharing ? '#4CAF50' : '#FF9800'
                  }}></div>
                  <span style={{ fontSize: '14px' }}>
                    {isLocationSharing ? '📍 Location sharing enabled' : '📍 Enable location for better experience'}
                  </span>
                </div>

                {/* Selected Bus Card */}
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '25px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>🚌</div>
                    <div>
                      <h3 style={{
                        margin: '0 0 5px 0',
                        fontSize: '18px',
                        fontWeight: '600'
                      }}>Route {selectedBusId ? buses.find(b => b.id === selectedBusId)?.routeNumber : buses[0]?.routeNumber || '42A'}</h3>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#4CAF50'
                        }}></div>
                        <span style={{
                          color: '#4CAF50',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>On time</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '13px', opacity: '0.8' }}>
                    Next stop: {selectedBusId ? buses.find(b => b.id === selectedBusId)?.nextStop : buses[0]?.nextStop || 'Central Station'}
                  </div>
                </div>

                {/* Bus Details */}
                <div style={{ marginBottom: '30px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <span style={{ opacity: '0.7' }}>Status</span>
                    <span style={{
                      color: '#4CAF50',
                      fontWeight: '500'
                    }}>Moving</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <span style={{ opacity: '0.7' }}>Capacity</span>
                    <span style={{
                      color: '#FF9800',
                      fontWeight: '500'
                    }}>75% Full</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <span style={{ opacity: '0.7' }}>Speed</span>
                    <span style={{
                      color: '#2196F3',
                      fontWeight: '500'
                    }}>{selectedBusId ? Math.round(buses.find(b => b.id === selectedBusId)?.speed || 0) : Math.round(buses[0]?.speed || 0)} km/h</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0'
                  }}>
                    <span style={{ opacity: '0.7' }}>ETA</span>
                    <span style={{
                      color: '#2196F3',
                      fontWeight: '500'
                    }}>12:45 PM</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                  <button style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                  >
                    📅 Schedule
                  </button>
                  <button style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  >
                    📍 Track
                  </button>
                </div>

                {/* All Buses List */}
                <div>
                  <h3 style={{
                    margin: '0 0 15px 0',
                    fontSize: '16px',
                    opacity: '0.9'
                  }}>Active Buses ({buses.length})</h3>
                  {buses.map((bus, index) => (
                    <div 
                      key={bus.id} 
                      onClick={() => setSelectedBusId(bus.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        marginBottom: '8px',
                        background: selectedBusId === bus.id ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255,255,255,0.03)',
                        borderRadius: '8px',
                        border: selectedBusId === bus.id ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedBusId !== bus.id) {
                          e.target.style.background = 'rgba(255,255,255,0.08)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedBusId !== bus.id) {
                          e.target.style.background = 'rgba(255,255,255,0.03)';
                        }
                      }}
                    >
                      <div style={{
                        width: '35px',
                        height: '35px',
                        background: bus.isActive ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px'
                      }}>🚌</div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontWeight: '500',
                          fontSize: '14px',
                          marginBottom: '2px'
                        }}>Route {bus.routeNumber}</div>
                        <div style={{
                          fontSize: '12px',
                          opacity: '0.6',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span>{Math.round(bus.speed)} km/h</span>
                          <span>•</span>
                          <span>{bus.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                      </div>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: bus.isActive ? '#4CAF50' : '#F44336'
                      }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          } />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Driver App Integrated View */}
          <Route path="/driver" element={
            <main style={{
              height: 'calc(100vh - 120px)',
              background: '#1a1a2e',
              padding: '30px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                width: '100%'
              }}>
                {/* Driver Header */}
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '20px',
                  padding: '30px',
                  textAlign: 'center',
                  color: 'white',
                  marginBottom: '30px'
                }}>
                  <h2 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>🚗 Driver Dashboard</h2>
                  <p style={{ margin: '0', opacity: '0.8' }}>Manage your bus route and share real-time location</p>
                </div>

                {/* Quick Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                  marginBottom: '30px'
                }}>
                  <div style={{
                    background: 'rgba(76, 175, 80, 0.1)',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    color: 'white'
                  }}>
                    <h3 style={{ margin: '0 0 5px 0', color: '#4CAF50' }}>Status</h3>
                    <p style={{ margin: '0', fontSize: '1.2rem', fontWeight: '600' }}>Online</p>
                  </div>
                  <div style={{
                    background: 'rgba(33, 150, 243, 0.1)',
                    border: '1px solid rgba(33, 150, 243, 0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    color: 'white'
                  }}>
                    <h3 style={{ margin: '0 0 5px 0', color: '#2196F3' }}>Route</h3>
                    <p style={{ margin: '0', fontSize: '1.2rem', fontWeight: '600' }}>42A</p>
                  </div>
                  <div style={{
                    background: 'rgba(255, 152, 0, 0.1)',
                    border: '1px solid rgba(255, 152, 0, 0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    color: 'white'
                  }}>
                    <h3 style={{ margin: '0 0 5px 0', color: '#FF9800' }}>Passengers</h3>
                    <p style={{ margin: '0', fontSize: '1.2rem', fontWeight: '600' }}>28/40</p>
                  </div>
                </div>

                {/* Driver Actions */}
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '20px',
                  padding: '30px'
                }}>
                  <h3 style={{ color: 'white', marginBottom: '20px' }}>Driver Controls</h3>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '15px'
                  }}>
                    <button 
                      onClick={() => {
                        setIsLocationSharing(!isLocationSharing);
                        if (!isLocationSharing) {
                          // Simulate starting location sharing
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              setUserLocation({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                              });
                              alert('Location sharing started! Your real-time location is now being tracked.');
                            },
                            (error) => {
                              alert('Unable to get location. Demo mode: Location sharing simulated.');
                            }
                          );
                        } else {
                          alert('Location sharing stopped.');
                        }
                      }}
                      style={{
                        background: isLocationSharing ? 
                          'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)' : 
                          'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '15px 20px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = isLocationSharing ? 
                          '0 8px 25px rgba(244, 67, 54, 0.3)' : 
                          '0 8px 25px rgba(76, 175, 80, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      {isLocationSharing ? '⏹️ Stop Location Sharing' : '📍 Start Location Sharing'}
                    </button>
                    
                    <button 
                      onClick={() => {
                        const statusOptions = ['on-route', 'delayed', 'ahead-of-schedule', 'breakdown'];
                        const currentIndex = statusOptions.indexOf(driverRouteStatus);
                        const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
                        setDriverRouteStatus(nextStatus);
                        
                        const statusMessages = {
                          'on-route': 'Route status: On schedule ✓',
                          'delayed': 'Route status: Delayed due to traffic ⚠️',
                          'ahead-of-schedule': 'Route status: Ahead of schedule ⚡',
                          'breakdown': 'Route status: Vehicle issue reported 🔧'
                        };
                        
                        alert(statusMessages[nextStatus]);
                      }}
                      style={{
                        background: {
                          'on-route': 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                          'delayed': 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                          'ahead-of-schedule': 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                          'breakdown': 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)'
                        }[driverRouteStatus] || 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '15px 20px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(33, 150, 243, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      🛣️ Update Route Status: {driverRouteStatus.replace('-', ' ').toUpperCase()}
                    </button>
                    
                    <button 
                      onClick={() => {
                        const notifications = [
                          'Bus arriving at next stop in 2 minutes',
                          'Slight delay due to traffic - new ETA: 3:45 PM',
                          'Bus is ahead of schedule - arriving early',
                          'Route change: Temporary stop at Central Mall',
                          'Driver break - 5 minute stop at terminal'
                        ];
                        
                        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
                        alert(`Notification sent to passengers:\n\n"${randomNotification}"\n\nAll passengers on route have been notified via the app.`);
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '15px 20px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(255, 152, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      📱 Send Notification
                    </button>
                    
                    <button 
                      onClick={() => window.open('http://localhost:3001', '_blank')}
                      style={{
                        background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '15px 20px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(156, 39, 176, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      🚀 Open Full Driver App
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '20px',
                  padding: '30px',
                  marginTop: '20px'
                }}>
                  <h3 style={{ color: 'white', marginBottom: '20px' }}>Recent Activity</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { time: '10:45 AM', action: 'Started route 42A', status: 'success' },
                      { time: '10:42 AM', action: 'Location sharing enabled', status: 'success' },
                      { time: '10:40 AM', action: 'Logged into driver system', status: 'info' }
                    ].map((activity, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        color: 'white'
                      }}>
                        <div>
                          <span style={{ opacity: '0.7', fontSize: '14px' }}>{activity.time}</span>
                          <span style={{ marginLeft: '12px' }}>{activity.action}</span>
                        </div>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: activity.status === 'success' ? '#4CAF50' : '#2196F3'
                        }}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;