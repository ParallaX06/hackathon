# Commands Reference - Transport Tracker

## 🚀 Quick Start Commands

### Initial Setup
```bash
# Clone and setup
git clone <your-repo>
cd hackathon
npm install

# Setup environment
cp .env.example .env
# Edit .env with your API keys

# Install Firebase CLI
npm install -g firebase-tools
firebase login
```

### Development
```bash
# Start main app (Terminal 1)
npm start                    # Runs on http://localhost:3000

# Start driver app (Terminal 2)  
cd driver-app
npm start                    # Runs on http://localhost:3001

# Start Firebase emulators (Terminal 3)
firebase emulators:start     # Local Firebase services
```

### Building
```bash
# Build main app
npm run build

# Build driver app
cd driver-app && npm run build && cd ..

# Build Firebase functions
cd functions && npm run build && cd ..

# Build everything
npm run build && cd driver-app && npm run build && cd .. && cd functions && npm run build && cd ..
```

### Deployment
```bash
# Quick deploy (automated)
./deploy.sh              # Linux/Mac
deploy.bat               # Windows

# Manual deploy
firebase deploy          # Deploy everything
firebase deploy --only hosting  # Hosting only
firebase deploy --only functions  # Functions only
```

## 📱 Development Commands

### Package Management
```bash
# Install dependencies
npm install                    # Main app
cd driver-app && npm install  # Driver app
cd functions && npm install   # Functions

# Update dependencies
npm update
npm audit fix              # Fix security issues

# Add new packages
npm install package-name
npm install -D package-name  # Dev dependency
```

### Firebase Commands
```bash
# Authentication
firebase login
firebase logout

# Project management
firebase projects:list
firebase use project-id
firebase use --add         # Add project alias

# Local development
firebase serve            # Serve built files locally
firebase emulators:start  # Start all emulators
firebase emulators:start --only firestore,functions

# Database
firebase firestore:delete --all-collections  # Clear database
firebase firestore:delete collection-name    # Delete collection
```

### Git Commands
```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main

# Daily workflow
git add .
git commit -m "Add feature description"
git push

# Branching
git checkout -b feature/new-feature
git checkout main
git merge feature/new-feature
```

## 🔧 Debugging Commands

### Check Status
```bash
# Node and npm versions
node --version
npm --version

# Firebase CLI version
firebase --version

# Check Firebase project
firebase projects:list
firebase use

# Check current directory
pwd              # Linux/Mac
cd               # Windows
```

### Logs and Debugging
```bash
# Firebase logs
firebase functions:log                    # Cloud Functions logs
firebase hosting:channel:list           # Hosting channels

# Local logs
npm run build 2>&1 | tee build.log     # Save build output
firebase emulators:start --debug        # Verbose emulator logs

# Clear caches
npm cache clean --force
rm -rf node_modules package-lock.json   # Linux/Mac
rmdir /s node_modules && del package-lock.json  # Windows
npm install
```

### Network Debugging
```bash
# Check ports
netstat -an | grep 3000    # Linux/Mac
netstat -an | findstr 3000 # Windows

# Find your IP for mobile testing
ipconfig                   # Windows
ifconfig                   # Linux/Mac
```

## 🧪 Testing Commands

### Basic Testing
```bash
# Run tests
npm test                   # Main app tests
cd driver-app && npm test  # Driver app tests

# Test coverage
npm run test:coverage

# Lint code
npm run lint              # Check code style
npm run lint:fix          # Auto-fix issues
```

### Manual Testing URLs
```bash
# Local development
Main App:     http://localhost:3000
Driver App:   http://localhost:3001
Firebase UI:  http://localhost:4000    # When emulators running

# Mobile testing (replace YOUR_IP)
Main App:     http://YOUR_IP:3000
Driver App:   http://YOUR_IP:3001
```

### Production Testing
```bash
# After deployment, test these URLs:
firebase hosting:channel:list          # Get preview URLs
firebase open hosting:site             # Open live site
```

## 📦 Build Optimization

### Production Builds
```bash
# Optimized production build
npm run build
cd driver-app && npm run build

# Analyze bundle size
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js

# Check build size
du -sh build/              # Linux/Mac
dir build /s               # Windows
```

### Performance Testing
```bash
# Lighthouse audit (install Chrome)
npm install -g lighthouse
lighthouse http://localhost:3000 --view

# Test mobile performance
lighthouse http://localhost:3000 --preset=perf --view
```

## 🔧 Troubleshooting Commands

### Common Issues

#### Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000              # Linux/Mac
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 $(lsof -ti:3000)   # Linux/Mac
taskkill /PID <PID> /F     # Windows (replace <PID>)
```

#### Permission Issues
```bash
# Fix npm permissions (Linux/Mac)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Windows: Run Command Prompt as Administrator
```

#### Firebase Issues
```bash
# Re-authenticate
firebase logout
firebase login

# Reset Firebase config
rm .firebaserc
firebase use --add

# Check Firebase status
curl -s https://status.firebase.google.com/
```

#### Build Issues
```bash
# Clear all caches
rm -rf node_modules build .firebase     # Linux/Mac
rmdir /s node_modules build .firebase   # Windows

# Reinstall everything
npm install
cd driver-app && npm install && cd ..
cd functions && npm install && cd ..
```

## 🚀 Production Commands

### Environment Setup
```bash
# Set production environment variables
export NODE_ENV=production              # Linux/Mac
set NODE_ENV=production                 # Windows

# Build for production
npm run build

# Test production build locally
npm install -g serve
serve -s build
```

### Monitoring
```bash
# Check Firebase usage
firebase projects:list
firebase use project-name
firebase functions:log --limit 50

# Monitor real-time
firebase database:get /                 # Realtime Database
firebase firestore:export gs://bucket  # Backup Firestore
```

### Scaling Commands
```bash
# Update Firebase functions memory
firebase functions:config:set runtime.memory=512MB

# Set up custom domain
firebase hosting:channel:deploy preview
firebase hosting:channel:clone live preview

# Update security rules
firebase deploy --only firestore:rules
```

## 📱 Mobile Development

### React Native (if converting)
```bash
# Install React Native CLI
npm install -g @react-native-community/cli

# Create new React Native project
npx react-native init TransportTrackerMobile

# Run on device
npx react-native run-android
npx react-native run-ios
```

### PWA Commands
```bash
# Test PWA features
npm install -g pwa-test
pwa-test http://localhost:3000

# Generate PWA assets
npm install -g pwa-asset-generator
pwa-asset-generator logo.png public/icons --manifest public/manifest.json
```

## 🔄 Maintenance Commands

### Regular Maintenance
```bash
# Update all dependencies
npm update
cd driver-app && npm update && cd ..
cd functions && npm update && cd ..

# Security audit
npm audit
npm audit fix

# Clean up old builds
rm -rf build driver-app/build functions/lib  # Linux/Mac
rmdir /s build driver-app\build functions\lib  # Windows
```

### Backup Commands
```bash
# Backup Firestore
gcloud firestore export gs://your-bucket/backup-$(date +%Y%m%d)

# Export environment
cat .env > backup-env-$(date +%Y%m%d).txt  # Linux/Mac
type .env > backup-env-%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt  # Windows

# Backup code
git archive --format=zip --output=backup-$(date +%Y%m%d).zip HEAD
```

---

**Pro Tips:**
- 💡 Use `&&` to chain commands: `npm install && npm start`
- 💡 Use `&` to run commands in background: `npm start &`
- 💡 Use `ctrl+c` to stop running processes
- 💡 Use `!!` to repeat last command (Linux/Mac)
- 💡 Use arrow keys to navigate command history

**Need help?** Run any command with `--help` flag for more options!