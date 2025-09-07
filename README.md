# Real-Time Public Transport Tracker 🚌

**Smart India Hackathon 2025 Project**

A beginner-friendly but scalable real-time public transport tracking system for tier-2 cities and small towns. This project addresses the lack of real-time bus tracking in smaller cities by providing a lightweight, low-bandwidth solution.

## 🌟 Features

### Core Features (MVP)
- **Real-time Bus Tracking**: Live GPS locations updated every 10 seconds
- **Driver App**: Simple interface for drivers to share their location
- **Passenger App**: Web-based map showing live bus positions
- **ETA Calculations**: Simple algorithm: ETA = Distance / Speed
- **Low Bandwidth Optimized**: Works efficiently on 2G/3G networks
- **Firebase Backend**: Scalable real-time database with Firestore
- **Google Maps Integration**: Interactive maps with bus markers

### Stretch Goals (Implemented)
- **Bus Movement Simulation**: Demo mode for testing and presentations
- **Route Management**: Support for multiple bus routes
- **Offline Sync**: Basic offline functionality with data caching
- **Error Handling**: Graceful error boundaries and recovery
- **PWA Features**: Service worker for offline capabilities

## 🏗️ Project Structure

```
transport-tracker/
├── src/                    # Main React app
│   ├── components/         # React components
│   ├── services/          # Firebase and API services
│   ├── utils/             # Utility functions
│   └── hooks/             # Custom React hooks
├── driver-app/            # Driver mobile app
├── functions/             # Firebase Cloud Functions
├── admin-dashboard/       # Admin panel (future)
├── public/               # Static assets
├── docs/                 # Documentation
├── firebase.json         # Firebase configuration
├── firestore.rules       # Database security rules
└── package.json          # Dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Firebase CLI (`npm install -g firebase-tools`)
- Google Maps API Key
- Firebase Project

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd hackathon
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
# Edit .env with your API keys
```

### 3. Firebase Setup
```bash
firebase login
firebase init
# Select your Firebase project
```

### 4. Start Development
```bash
# Start main app
npm start

# Start driver app (in another terminal)
cd driver-app && npm start

# Start Firebase emulators (optional)
firebase emulators:start
```

### 5. Demo Mode
Click "Start Demo" in the app to see simulated buses moving on the map.

## 📱 Applications

### Main App (Passenger Interface)
- **URL**: `http://localhost:3000`
- **Features**: Map view, route selection, real-time tracking
- **Optimized for**: Mobile browsers, low bandwidth

### Driver App
- **URL**: `http://localhost:3000/driver` or separate deployment
- **Features**: Location sharing, route assignment
- **Usage**: Drivers enter Bus ID and start tracking

### Admin Dashboard (Future)
- **URL**: `http://localhost:3000/admin`
- **Features**: Route management, analytics, driver management

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Authentication (optional)
4. Enable Cloud Functions
5. Copy your config to `.env`

### Google Maps Setup
1. Get API key from [Google Cloud Console](https://console.cloud.google.com)
2. Enable Maps JavaScript API
3. Enable Places API (optional)
4. Add key to `.env` as `REACT_APP_GOOGLE_MAPS_API_KEY`

### Environment Variables
```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your_app_id

# Google Maps
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key

# App Settings
REACT_APP_UPDATE_INTERVAL=10000
REACT_APP_DEFAULT_ZOOM=14
```

## 🚀 Deployment

### Automated Deployment
```bash
# Linux/Mac
./deploy.sh

# Windows
deploy.bat
```

### Manual Deployment
```bash
# Build all apps
npm run build
cd driver-app && npm run build && cd ..
cd functions && npm run build && cd ..

# Deploy to Firebase
firebase deploy
```

### Production URLs
- **Main App**: `https://your-project.web.app`
- **Driver App**: `https://your-project-driver.web.app`
- **Admin**: `https://your-project-admin.web.app`

## 🧪 Testing & Demo

### Demo Mode
1. Open the main app
2. Click "Start Demo" button
3. Watch simulated buses move on predefined routes
4. Perfect for hackathon presentations!

### Real Testing
1. Open driver app on mobile device
2. Enter a unique Bus ID (e.g., "BUS001")
3. Click "Start Tracking"
4. View the bus location on the main app

## 📊 Database Structure

### Collections

#### `buses`
```javascript
{
  id: 'bus-001',
  routeId: 'route-1',
  location: { latitude: 28.6139, longitude: 77.2090 },
  speed: 25,
  isActive: true,
  routeNumber: '101',
  lastUpdated: timestamp
}
```

#### `routes`
```javascript
{
  id: 'route-1',
  name: 'City Center to Airport',
  routeNumber: '101',
  stops: [...],
  isActive: true
}
```

#### `busStops`
```javascript
{
  id: 'stop-1',
  name: 'City Center',
  location: { latitude: 28.6139, longitude: 77.2090 },
  routeId: 'route-1',
  sequence: 1
}
```

## 💡 Low Bandwidth Optimizations

1. **Adaptive Updates**: Slower refresh rates on poor connections
2. **Data Compression**: Minimal data payload
3. **Image Optimization**: SVG icons instead of images
4. **Caching**: Service worker for offline functionality
5. **Progressive Loading**: Essential data first

## 🔄 Extending the Project

### Adding New Features
1. **Route Planning**: Integration with routing APIs
2. **Notifications**: Push notifications for bus arrivals
3. **Payment Integration**: Ticket booking system
4. **Analytics**: Usage analytics and reporting
5. **Multi-language**: Localization support

### Scaling Considerations
1. **CDN Integration**: For static assets
2. **Database Sharding**: For large datasets
3. **Load Balancing**: For high traffic
4. **Monitoring**: Error tracking and performance monitoring

## 🛠️ Development Commands

```bash
# Development
npm start                    # Start main app
npm run driver-app          # Start driver app
firebase emulators:start    # Start Firebase emulators

# Building
npm run build               # Build main app
npm run build:all           # Build all applications

# Testing
npm test                    # Run tests
npm run test:coverage       # Test with coverage

# Deployment
npm run deploy              # Deploy to Firebase
npm run deploy:functions    # Deploy functions only
```

## 🤝 Contributing

### For Hackathon Teams
1. **Fork the repository**
2. **Create feature branches** for each team member
3. **Focus on one component** per developer
4. **Use the demo mode** for presentations
5. **Document your additions** in README

### Development Workflow
1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and test locally
3. Update documentation if needed
4. Create pull request with clear description

## 📚 Documentation

- [Setup Guide](docs/SETUP.md) - Detailed setup instructions
- [API Documentation](docs/API.md) - Backend API reference
- [Component Guide](docs/COMPONENTS.md) - Frontend component docs
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment

## 🏆 Hackathon Tips

1. **Use Demo Mode**: Perfect for presentations without real buses
2. **Focus on UI/UX**: Visual appeal matters in hackathons
3. **Prepare Data**: Load some demo routes and stops
4. **Practice Demo**: Know your app inside and out
5. **Highlight Innovation**: Emphasize the low-bandwidth optimization

## 🔒 Security

- Firestore security rules prevent unauthorized access
- API endpoints validate input
- CORS configured for web safety
- No sensitive data stored client-side

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

## 👥 Team

**Smart India Hackathon 2025 Team**
- Add your team members here
- Include roles and contributions

## 🙏 Acknowledgments

- Firebase for real-time backend
- Google Maps for mapping services
- React community for excellent documentation
- Open source contributors

---

**Built with ❤️ for Smart India Hackathon 2025**

For support or questions, create an issue in this repository.