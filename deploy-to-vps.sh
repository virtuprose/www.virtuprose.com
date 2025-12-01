#!/bin/bash

# Complete VPS Deployment Script
# This script will set up everything on your VPS

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 VirtuProse Website - VPS Deployment${NC}"
echo "=============================================="

# Configuration
APP_DIR="/var/www/vps-app"
REPO_URL="https://github.com/virtuprose/www.virtuprose.com.git"
BRANCH="main"
PORT=3000

# Step 1: Update system
echo -e "\n${BLUE}[1/9] Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Step 2: Install Node.js 20
echo -e "\n${BLUE}[2/9] Installing Node.js 20...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo -e "${GREEN}✅ Node.js $(node --version) installed${NC}"
else
    echo -e "${GREEN}✅ Node.js $(node --version) already installed${NC}"
fi

# Step 3: Install PM2
echo -e "\n${BLUE}[3/9] Installing PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    echo -e "${GREEN}✅ PM2 installed${NC}"
else
    echo -e "${GREEN}✅ PM2 already installed${NC}"
fi

# Step 4: Install Nginx
echo -e "\n${BLUE}[4/9] Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    sudo apt install nginx -y
    sudo systemctl enable nginx
    sudo systemctl start nginx
    echo -e "${GREEN}✅ Nginx installed and started${NC}"
else
    echo -e "${GREEN}✅ Nginx already installed${NC}"
fi

# Step 5: Create app directory
echo -e "\n${BLUE}[5/9] Setting up application directory...${NC}"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR
cd $APP_DIR

# Step 6: Clone repository
echo -e "\n${BLUE}[6/9] Cloning repository...${NC}"
if [ -d ".git" ]; then
    echo "Repository exists, pulling latest changes..."
    git pull origin $BRANCH
else
    git clone -b $BRANCH $REPO_URL .
    echo -e "${GREEN}✅ Repository cloned${NC}"
fi

# Step 7: Install dependencies and build
echo -e "\n${BLUE}[7/9] Installing dependencies...${NC}"
npm ci

echo -e "\n${BLUE}Building application...${NC}"
npm run build

# Step 8: Setup environment variables
echo -e "\n${BLUE}[8/9] Setting up environment variables...${NC}"
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${YELLOW}⚠️  .env file created from template${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env file with your configuration:${NC}"
        echo -e "${YELLOW}   nano $APP_DIR/.env${NC}"
    else
        echo -e "${RED}❌ .env.example not found!${NC}"
    fi
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Step 9: Start with PM2
echo -e "\n${BLUE}[9/9] Starting application with PM2...${NC}"
mkdir -p logs

if pm2 list | grep -q "vps-app"; then
    pm2 reload ecosystem.config.js
    echo -e "${GREEN}✅ Application reloaded${NC}"
else
    pm2 start ecosystem.config.js
    pm2 save
    echo -e "${GREEN}✅ Application started${NC}"
fi

# Setup PM2 startup
echo -e "\n${BLUE}Setting up PM2 startup...${NC}"
pm2 startup | grep "sudo" | bash || echo "Startup already configured"

# Show status
echo -e "\n${GREEN}=============================================="
echo "✅ Deployment Complete!"
echo "=============================================="
echo ""
echo -e "${BLUE}Application Status:${NC}"
pm2 status
echo ""
echo -e "${BLUE}Application is running on: http://localhost:$PORT${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Edit environment variables: nano $APP_DIR/.env"
echo "2. Configure Nginx (see nginx.conf.example)"
echo "3. Set up SSL certificate with Certbot"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo "  pm2 logs vps-app        # View logs"
echo "  pm2 restart vps-app     # Restart app"
echo "  pm2 status              # Check status"
echo ""

