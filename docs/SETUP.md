# Setup Guide - Real-Time Public Transport Tracker

This guide will walk you through setting up the Real-Time Public Transport Tracker from scratch, perfect for beginners.

## Prerequisites

### Required Software
1. **Node.js** (version 16 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **Git** (for cloning the repository)
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify installation: `git --version`

3. **Code Editor** (recommended: VS Code)
   - Download from [code.visualstudio.com](https://code.visualstudio.com/)

### Required Accounts
1. **Firebase Account** (free)
   - Sign up at [firebase.google.com](https://firebase.google.com/)

2. **Google Cloud Account** (free tier available)
   - Sign up at [cloud.google.com](https://cloud.google.com/)

## Step 1: Project Setup

### 1.1 Clone the Repository
```bash
git clone <your-repository-url>
cd hackathon
```

### 1.2 Install Dependencies
```bash
# Install main app dependencies
npm install

# Install driver app dependencies
cd driver-app
npm install
cd ..

# Install Firebase functions dependencies
cd functions
npm install
cd ..
```

### 1.3 Install Firebase CLI
```bash
npm install -g firebase-tools
firebase --version
```

## Step 2: Firebase Configuration

### 2.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `transport-tracker-sih2025`
4. Enable Google Analytics (optional)
5. Create project

### 2.2 Enable Firebase Services

#### Enable Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location near your users

#### Enable Authentication (Optional)
1. Go to "Authentication" > "Sign-in method"
2. Enable "Anonymous" for basic functionality
3. Enable "Email/Password" if you want user accounts

#### Enable Cloud Functions
1. Go to "Functions"
2. Click "Get started"
3. Follow the setup instructions

### 2.3 Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click "Web app" icon
4. Register app with name "Transport Tracker"
5. Copy the configuration object

### 2.4 Set Up Environment Variables
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your Firebase config:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

## Step 3: Google Maps Setup

### 3.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable billing (required for Maps API)

### 3.2 Enable Required APIs
1. Go to "APIs & Services" > "Library"
2. Search and enable:
   - Maps JavaScript API
   - Places API (optional)
   - Geocoding API (optional)

### 3.3 Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key
4. Click "Restrict Key" for security:
   - Application restrictions: HTTP referrers
   - Add your domain: `http://localhost:3000/*`
   - API restrictions: Select the APIs you enabled

### 3.4 Add to Environment
Add to your `.env` file:
```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Step 4: Firebase Project Initialization

### 4.1 Login to Firebase
```bash
firebase login
```

### 4.2 Initialize Firebase in Project
```bash
firebase init
```

Select:
- ✅ Firestore
- ✅ Functions
- ✅ Hosting

Configuration:
- Firestore rules: `firestore.rules`
- Firestore indexes: `firestore.indexes.json`
- Functions language: TypeScript
- Functions source: `functions`
- Public directory: `build`
- Single-page app: Yes
- GitHub deployment: No (for now)

## Step 5: Development Setup

### 5.1 Start Development Servers

#### Terminal 1 - Main App
```bash
npm start
```
This starts the main passenger app at `http://localhost:3000`

#### Terminal 2 - Driver App
```bash
cd driver-app
npm start
```
This starts the driver app at `http://localhost:3001`

#### Terminal 3 - Firebase Emulators (Optional)
```bash
firebase emulators:start
```
This starts local Firebase emulators for testing

### 5.2 Verify Setup
1. Open `http://localhost:3000` in your browser
2. You should see the Transport Tracker interface
3. Click "Start Demo" to see simulated buses
4. Open `http://localhost:3001` for the driver interface

## Step 6: Add Demo Data

### 6.1 Using the Simulation
The easiest way to test the app is using the built-in simulation:
1. Open the main app
2. Click "Start Demo" button
3. Watch buses move on the map

### 6.2 Manual Data Entry (Optional)
You can add routes and bus stops manually in Firestore:

#### Add a Route
```javascript
// In Firestore Console, add to 'routes' collection
{
  id: 'route-1',
  name: 'City Center to Airport',
  routeNumber: '101',
  isActive: true
}
```

#### Add Bus Stops
```javascript
// Add to 'busStops' collection
{
  id: 'stop-1',
  name: 'City Center',
  routeId: 'route-1',
  location: {
    latitude: 28.6139,
    longitude: 77.2090
  },
  sequence: 1
}
```

## Step 7: Testing the Driver App

### 7.1 Test Location Sharing
1. Open driver app: `http://localhost:3001`
2. Enter Bus ID: `TEST001`
3. Enter Route Number: `101`
4. Click "Start Tracking"
5. Allow location permissions
6. Check main app to see your bus appear

### 7.2 Test with Mobile Device
1. Find your computer's IP address: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Open `http://YOUR_IP:3001` on mobile browser
3. Test real GPS tracking

## Step 8: Production Deployment

### 8.1 Build Applications
```bash
# Build main app
npm run build

# Build driver app
cd driver-app
npm run build
cd ..

# Build functions
cd functions
npm run build
cd ..
```

### 8.2 Deploy to Firebase
```bash
firebase deploy
```

### 8.3 Get Production URLs
After deployment, you'll get URLs like:
- Main app: `https://your-project.web.app`
- Driver app: `https://your-project-driver.web.app`

## Troubleshooting

### Common Issues

#### "Module not found" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Firebase permission errors
```bash
# Re-authenticate
firebase logout
firebase login
```

#### Google Maps not loading
- Check API key in `.env`
- Verify APIs are enabled in Google Cloud Console
- Check browser developer console for errors

#### Location not working
- Use HTTPS in production (HTTP only works on localhost)
- Ensure location permissions are granted
- Test on actual mobile device

### Getting Help

1. **Check browser developer console** for error messages
2. **Check Firebase Console** for database and function logs
3. **Review documentation** in the `docs/` folder
4. **Create an issue** in the GitHub repository

## Next Steps

Once your basic setup is working:

1. **Customize the UI** with your city's branding
2. **Add real bus routes** for your area
3. **Set up monitoring** and analytics
4. **Plan for scaling** based on expected usage
5. **Add advanced features** like notifications

## Security Checklist

Before going to production:

- [ ] Update Firestore security rules
- [ ] Restrict Google Maps API key domains
- [ ] Enable Firebase App Check
- [ ] Set up monitoring and alerting
- [ ] Review and limit Firebase quotas
- [ ] Add proper error logging

---

**Need more help?** Check out the other documentation files or create an issue in the repository!