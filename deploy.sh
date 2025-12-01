#!/bin/bash

# VPS Deployment Script for VirtuProse Website
# This script automates the deployment process on your VPS

set -e  # Exit on error

echo "🚀 Starting deployment process..."

# Configuration - Update these variables
APP_DIR="/var/www/vps-app"
REPO_URL="https://github.com/virtuprose/www.virtuprose.com.git"
BRANCH="main"
PM2_APP_NAME="vps-app"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root or with sudo${NC}"
    exit 1
fi

# Create app directory if it doesn't exist
if [ ! -d "$APP_DIR" ]; then
    echo -e "${BLUE}Creating application directory...${NC}"
    mkdir -p $APP_DIR
fi

# Navigate to app directory
cd $APP_DIR

# Clone or pull from repository
if [ -d ".git" ]; then
    echo -e "${BLUE}Pulling latest changes from repository...${NC}"
    git pull origin $BRANCH
else
    echo -e "${BLUE}Cloning repository...${NC}"
    git clone -b $BRANCH $REPO_URL .
fi

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm ci --production=false

# Build the application
echo -e "${BLUE}Building Next.js application...${NC}"
npm run build

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}⚠️  WARNING: .env file not found!${NC}"
    echo -e "${BLUE}Copying .env.example to .env...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${RED}Please edit .env file with your configuration before continuing!${NC}"
    else
        echo -e "${RED}Error: .env.example not found!${NC}"
        exit 1
    fi
fi

# Create logs directory
mkdir -p logs

# Restart PM2 application
echo -e "${BLUE}Restarting application with PM2...${NC}"
if command -v pm2 &> /dev/null; then
    pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js
    pm2 save
    echo -e "${GREEN}✅ Application restarted successfully!${NC}"
else
    echo -e "${RED}PM2 not found. Please install PM2 first: npm install -g pm2${NC}"
    exit 1
fi

# Show application status
echo -e "${BLUE}Application status:${NC}"
pm2 status

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${BLUE}Your application should be running on port 3000${NC}"

