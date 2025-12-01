#!/bin/bash

# Deployment Script for VirtuProse.com on VPS
# Directory: /www/wwwroot/virtuprose.com
# IMPORTANT: Does not interfere with orviahq.cloud

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Deploying VirtuProse.com to VPS${NC}"
echo "=========================================="

# Configuration
APP_DIR="/www/wwwroot/virtuprose.com"
REPO_URL="https://github.com/virtuprose/www.virtuprose.com.git"
BRANCH="main"
PORT=3001
APP_NAME="virtuprose-com"

echo -e "${BLUE}Application directory: $APP_DIR${NC}"
echo -e "${BLUE}Port: $PORT${NC}"
echo -e "${BLUE}App name: $APP_NAME${NC}"
echo ""

# Step 1: Create directory
echo -e "${BLUE}[1/8] Creating application directory...${NC}"
mkdir -p $APP_DIR
cd $APP_DIR

# Step 2: Clone or pull repository
echo -e "${BLUE}[2/8] Setting up repository...${NC}"
if [ -d ".git" ]; then
    echo "Repository exists, pulling latest changes..."
    git pull origin $BRANCH || echo "Git pull failed, continuing..."
else
    echo "Cloning repository..."
    git clone -b $BRANCH $REPO_URL .
fi

# Step 3: Copy environment variables
echo -e "${BLUE}[3/8] Setting up environment variables...${NC}"
if [ -f ".env.production" ]; then
    cp .env.production .env
    echo -e "${GREEN}✅ Environment variables copied from .env.production${NC}"
elif [ -f ".env.example" ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Using .env.example template - please update .env file${NC}"
else
    echo -e "${RED}❌ No environment file found!${NC}"
fi

# Ensure PORT is set in .env
if ! grep -q "PORT=" .env 2>/dev/null; then
    echo "PORT=$PORT" >> .env
fi

# Step 4: Install dependencies
echo -e "${BLUE}[4/8] Installing dependencies...${NC}"
npm ci

# Step 5: Build application
echo -e "${BLUE}[5/8] Building Next.js application...${NC}"
npm run build

# Step 6: Create logs directory
echo -e "${BLUE}[6/8] Setting up logs directory...${NC}"
mkdir -p logs

# Step 7: Start with PM2
echo -e "${BLUE}[7/8] Starting application with PM2...${NC}"
if pm2 list | grep -q "$APP_NAME"; then
    pm2 reload $APP_NAME
    echo -e "${GREEN}✅ Application reloaded${NC}"
else
    pm2 start ecosystem.config.js --env production
    pm2 save
    echo -e "${GREEN}✅ Application started${NC}"
fi

# Step 8: Show status
echo -e "${BLUE}[8/8] Deployment complete!${NC}"
echo ""
echo -e "${GREEN}=========================================="
echo "✅ Deployment Successful!"
echo "=========================================="
echo ""
pm2 status | grep -A 5 "$APP_NAME" || pm2 status
echo ""
echo -e "${BLUE}Application running on: http://localhost:$PORT${NC}"
echo -e "${BLUE}PM2 App Name: $APP_NAME${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Check logs: pm2 logs $APP_NAME"
echo "2. Configure Nginx for virtuprose.com"
echo "3. Test the application"

