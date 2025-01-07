#!/bin/bash
# Install dependencies for backend
npm install

# Navigate to frontend directory
cd employee-frontend

# Install frontend dependencies
npm install

# Build frontend
npm run build

# Return to root
cd .. 