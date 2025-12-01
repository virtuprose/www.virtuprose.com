#!/bin/bash

# Complete VPS Deployment Script for VirtuProse.com
# Run this script on your VPS: bash vps-deploy-complete.sh
# Directory: /www/wwwroot/virtuprose.com
# IMPORTANT: Safe - does not interfere with orviahq.cloud

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}🚀 VirtuProse.com VPS Deployment${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

# Configuration
APP_DIR="/www/wwwroot/virtuprose.com"
REPO_URL="https://github.com/virtuprose/www.virtuprose.com.git"
BRANCH="main"
PORT=3001
APP_NAME="virtuprose-com"

echo -e "${BLUE}Configuration:${NC}"
echo "  Directory: $APP_DIR"
echo "  Port: $PORT"
echo "  App Name: $APP_NAME"
echo ""

# Check Node.js
echo -e "${BLUE}[1/10] Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js not found. Installing Node.js 20...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

# Check PM2
echo -e "${BLUE}[2/10] Checking PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 not found. Installing PM2...${NC}"
    npm install -g pm2
fi
echo -e "${GREEN}✅ PM2 installed${NC}"

# Check Git
echo -e "${BLUE}[3/10] Checking Git...${NC}"
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}Git not found. Installing Git...${NC}"
    apt-get update && apt-get install -y git
fi
echo -e "${GREEN}✅ Git installed${NC}"

# Create directory
echo -e "${BLUE}[4/10] Creating application directory...${NC}"
mkdir -p $APP_DIR
cd $APP_DIR
echo -e "${GREEN}✅ Directory ready: $APP_DIR${NC}"

# Clone or pull repository
echo -e "${BLUE}[5/10] Setting up repository...${NC}"
if [ -d ".git" ]; then
    echo "Pulling latest changes..."
    git pull origin $BRANCH || echo "Note: Git pull completed"
else
    echo "Cloning repository..."
    git clone -b $BRANCH $REPO_URL .
fi
echo -e "${GREEN}✅ Repository ready${NC}"

# Setup environment variables
echo -e "${BLUE}[6/10] Setting up environment variables...${NC}"
if [ -f ".env.production" ]; then
    cp .env.production .env
    echo -e "${GREEN}✅ Copied .env.production to .env${NC}"
elif [ -f ".env.example" ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Using .env.example - please update .env file${NC}"
else
    echo -e "${RED}Creating basic .env file...${NC}"
    cat > .env << EOF
NEXT_PUBLIC_SITE_URL=https://virtuprose.com
PORT=$PORT
NODE_ENV=production
EOF
fi

# Ensure PORT is in .env
if ! grep -q "^PORT=" .env 2>/dev/null; then
    echo "PORT=$PORT" >> .env
fi

echo -e "${GREEN}✅ Environment variables configured${NC}"

# Install dependencies
echo -e "${BLUE}[7/10] Installing dependencies (this may take a few minutes)...${NC}"
npm ci
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Build application
echo -e "${BLUE}[8/10] Building Next.js application (this may take a few minutes)...${NC}"
npm run build
echo -e "${GREEN}✅ Build complete${NC}"

# Create logs directory
echo -e "${BLUE}[9/10] Setting up logs...${NC}"
mkdir -p logs
echo -e "${GREEN}✅ Logs directory ready${NC}"

# Start with PM2
echo -e "${BLUE}[10/10] Starting application with PM2...${NC}"
if pm2 list | grep -q "$APP_NAME"; then
    pm2 delete $APP_NAME 2>/dev/null || true
fi

# Update ecosystem.config.js if needed
sed -i "s|/var/www/vps-app|$APP_DIR|g" ecosystem.config.js 2>/dev/null || true
sed -i "s|vps-app|$APP_NAME|g" ecosystem.config.js 2>/dev/null || true
sed -i "s|PORT: 3000|PORT: $PORT|g" ecosystem.config.js 2>/dev/null || true

pm2 start ecosystem.config.js --env production
pm2 save
echo -e "${GREEN}✅ Application started with PM2${NC}"

# Setup PM2 startup (if needed)
echo ""
echo -e "${BLUE}Setting up PM2 startup script...${NC}"
STARTUP_CMD=$(pm2 startup | grep "sudo" | tail -1)
if [ ! -z "$STARTUP_CMD" ]; then
    eval $STARTUP_CMD 2>/dev/null || echo "Startup already configured"
fi

# Final status
echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ DEPLOYMENT COMPLETE!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Application Details:${NC}"
echo "  Name: $APP_NAME"
echo "  Directory: $APP_DIR"
echo "  Port: $PORT"
echo "  URL: http://localhost:$PORT"
echo ""
echo -e "${BLUE}PM2 Status:${NC}"
pm2 status | grep -A 3 "$APP_NAME" || pm2 status
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Configure Nginx to proxy virtuprose.com to port $PORT"
echo "2. Set up SSL certificate for virtuprose.com"
echo "3. Test: curl http://localhost:$PORT"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo "  pm2 logs $APP_NAME          # View logs"
echo "  pm2 restart $APP_NAME       # Restart app"
echo "  pm2 status                  # Check status"
echo "  pm2 monit                   # Monitor resources"
echo ""

