#!/bin/bash

# Quick VPS Setup Script
# Run this script on your VPS to install all required dependencies

set -e

echo "🔧 Starting VPS setup for VirtuProse Website..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
echo "📦 Installing Node.js 20..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "✅ Node.js already installed: $(node --version)"
fi

# Install PM2
echo "📦 Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
else
    echo "✅ PM2 already installed"
fi

# Install Nginx
echo "📦 Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt install nginx -y
    sudo systemctl enable nginx
    sudo systemctl start nginx
else
    echo "✅ Nginx already installed"
fi

# Install Git
echo "📦 Installing Git..."
if ! command -v git &> /dev/null; then
    sudo apt install git -y
else
    echo "✅ Git already installed"
fi

# Install Certbot for SSL
echo "📦 Installing Certbot for SSL..."
if ! command -v certbot &> /dev/null; then
    sudo apt install certbot python3-certbot-nginx -y
else
    echo "✅ Certbot already installed"
fi

echo ""
echo "✅ VPS setup completed!"
echo ""
echo "Next steps:"
echo "1. Clone your repository: git clone https://github.com/virtuprose/www.virtuprose.com.git /var/www/vps-app"
echo "2. Follow the VPS_DEPLOYMENT_GUIDE.md for complete setup instructions"

