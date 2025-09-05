# Smart Transit - Real-Time Public Transport Tracker

A comprehensive real-time bus tracking system built for Smart India Hackathon 2025. This application enables drivers to share live GPS locations and allows commuters to track buses in real-time with ETA calculations.

## 🎯 Project Overview

**Problem Statement**: In small cities and tier-2 towns, buses don't have real-time tracking systems, making it difficult for commuters to plan their journeys effectively.

**Solution**: A lightweight, scalable mobile/web platform that provides:
- Real-time GPS tracking of buses
- Live location updates every 10 seconds
- ETA calculations for bus stops
- Low-bandwidth optimization for poor network conditions
- Separate interfaces for drivers, commuters, and administrators

## 🚀 Features

### Core Features
- **Real-time Bus Tracking**: Live GPS updates every 10 seconds
- **Interactive Map Interface**: Visual representation of bus locations and routes
- **Driver Panel**: GPS tracking controls and passenger count management
- **Commuter Dashboard**: Bus schedules, ETA calculations, and crowding information
- **Admin Dashboard**: System overview, route performance, and alerts
- **Low-bandwidth Optimization**: Works efficiently in poor network conditions
- **Responsive Design**: Optimized for both mobile and desktop devices

### Technical Features
- **Firebase Integration**: Real-time database with Firestore
- **Google Maps API**: Interactive maps and route visualization
- **Progressive Web App**: Works offline with cached data
- **Network-aware**: Adjusts update frequency based on connection quality
- **Clean Architecture**: Modular, scalable codebase structure

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Firebase (Firestore + Functions + Hosting)
- **Maps**: Google Maps API / Mapbox
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Firebase Hosting

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── MapContainer.tsx      # Interactive map with live bus markers
│   ├── Navigation.tsx        # App navigation and status indicators
│   ├── DriverPanel.tsx       # Driver interface for GPS tracking
│   ├── CommuterDashboard.tsx # Commuter interface for bus info
│   └── AdminDashboard.tsx    # Admin interface for system management
├── context/            # React context for state management
│   └── TransportContext.tsx # Global transport state management
├── firebase/           # Firebase configuration
│   └── config.ts            # Firebase setup and mock operations
├── utils/              # Utility functions
│   ├── geoUtils.ts          # GPS and location calculations
│   └── networkUtils.ts      # Network optimization utilities
├── App.tsx            # Main application component
├── main.tsx          # Application entry point
└── index.css         # Global styles with Tailwind

firebase/              # Firebase configuration
├── functions/         # Cloud Functions for backend logic
├── firestore.rules   # Firestore security rules
└── firebase.json     # Firebase project configuration
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Firebase CLI
- Google Maps API key

### Local Development

1. **Clone and Install Dependencies**
```bash
npm install
```

2. **Start Development Server**
```bash
npm run dev
```

3. **Access the Application**
Open http://localhost:5173 in your browser

### Firebase Setup (Production)

1. **Create Firebase Project**
```bash
firebase login
firebase init
```

2. **Configure Environment Variables**
Create `.env` file with:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key
```

3. **Deploy to Firebase**
```bash
npm run build
firebase deploy
```

## 📱 Usage Guide

### For Commuters
1. Open the app and select "Commuter" mode
2. Choose your bus stop from the dropdown
3. View live bus locations and ETAs
4. Track bus crowding levels and plan accordingly

### For Drivers
1. Switch to "Driver" mode
2. Click "Start GPS Tracking" to begin sharing location
3. Update passenger count at each stop
4. Monitor speed and route performance

### For Administrators
1. Access "Admin" dashboard
2. Monitor system overview and statistics
3. View route performance metrics
4. Manage alerts and system configuration

## 🔍 Key Algorithms

### ETA Calculation
```typescript
ETA = Distance_to_stop / Current_speed
```

### Network Optimization
- **2G Networks**: 30-second update intervals
- **3G Networks**: 15-second update intervals  
- **4G/5G Networks**: 10-second update intervals
- **Offline Mode**: Queue updates for synchronization

### Distance Calculation (Haversine Formula)
```typescript
function calculateDistance(point1, point2) {
  // Implementation uses Earth's radius and trigonometric calculations
  // Returns distance in kilometers
}
```

## 🚀 Scaling & Optimization

### Low-bandwidth Optimizations
- Compressed location data transmission
- Adaptive update frequencies based on network conditions
- Offline data caching and synchronization
- Minimal UI with efficient rendering

### Performance Features
- React Context for efficient state management
- Memoized components to prevent unnecessary re-renders
- Lazy loading for non-critical components
- Optimized bundle size with tree shaking

## 🎯 Smart India Hackathon 2025 Alignment

### Problem Solving
- **Rural/Urban Gap**: Works efficiently in low-bandwidth environments
- **Cost-effective**: Uses existing smartphone infrastructure
- **Scalable**: Cloud-based architecture supports growth
- **User-friendly**: Intuitive interfaces for all user types

### Innovation Aspects
- Real-time synchronization across multiple devices
- Network-aware performance optimization
- Comprehensive multi-role system (Driver/Commuter/Admin)
- Production-ready architecture with clean code practices

## 🔮 Future Enhancements

### Phase 2 Features
- **Push Notifications**: "Bus arriving in X minutes"
- **Route Optimization**: AI-powered route suggestions
- **Payment Integration**: Digital ticketing system
- **Analytics Dashboard**: Usage patterns and insights

### Phase 3 Features
- **Multi-modal Transport**: Trains, metros, auto-rickshaws
- **Crowd Sourcing**: User-reported incidents and delays
- **Integration APIs**: Third-party transport apps
- **AI Predictions**: Machine learning for accurate ETAs

## 🤝 Contributing

This project is designed for easy extension and contribution:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-feature`
3. **Follow coding standards**: ESLint and TypeScript configured
4. **Add tests**: For new functionality
5. **Submit pull request**: With detailed description

## 📄 License

MIT License - Feel free to use this project for educational and commercial purposes.

## 🏆 Hackathon Submission

**Team**: [Your Team Name]  
**Category**: Smart Transportation Solutions  
**Timeline**: Built for SIH 2025  
**Demo**: [Live Demo URL]  
**Presentation**: [Presentation URL]

---

Built with ❤️ for Smart India Hackathon 2025