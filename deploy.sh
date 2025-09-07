#!/bin/bash

# Real-Time Public Transport Tracker - Deployment Script
# Smart India Hackathon 2025

echo "🚌 Starting deployment of Transport Tracker..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16 or higher."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    # Check Firebase CLI
    if ! command -v firebase &> /dev/null; then
        print_warning "Firebase CLI is not installed. Installing..."
        npm install -g firebase-tools
    fi
    
    print_success "All requirements satisfied!"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Main app dependencies
    npm install
    
    # Driver app dependencies
    cd driver-app
    npm install
    cd ..
    
    # Functions dependencies
    cd functions
    npm install
    cd ..
    
    print_success "Dependencies installed!"
}

# Build all applications
build_applications() {
    print_status "Building applications..."
    
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
    
    print_success "All applications built successfully!"
}

# Deploy to Firebase
deploy_to_firebase() {
    print_status "Deploying to Firebase..."
    
    # Login to Firebase (if not already logged in)
    firebase login
    
    # Deploy everything
    firebase deploy
    
    print_success "Deployment completed!"
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_warning "Created .env file from .env.example"
            print_warning "Please update .env with your actual Firebase and Google Maps API keys"
        else
            print_error ".env.example file not found"
            exit 1
        fi
    else
        print_success "Environment file already exists"
    fi
}

# Main deployment flow
main() {
    echo "🚀 Real-Time Public Transport Tracker Deployment"
    echo "================================================"
    
    check_requirements
    setup_environment
    install_dependencies
    build_applications
    deploy_to_firebase
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Update your .env file with actual API keys"
    echo "2. Configure Firebase project settings"
    echo "3. Set up Google Maps API and enable required services"
    echo "4. Test the application in your deployed environment"
    echo ""
    echo "For detailed setup instructions, see docs/SETUP.md"
}

# Handle command line arguments
case "${1:-deploy}" in
    "deps")
        install_dependencies
        ;;
    "build")
        build_applications
        ;;
    "deploy")
        main
        ;;
    "check")
        check_requirements
        ;;
    *)
        echo "Usage: $0 [deps|build|deploy|check]"
        echo "  deps   - Install dependencies only"
        echo "  build  - Build applications only"
        echo "  deploy - Full deployment (default)"
        echo "  check  - Check requirements only"
        ;;
esac