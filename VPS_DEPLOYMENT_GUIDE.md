# VPS Deployment Guide - VirtuProse Website

Complete guide for deploying the VirtuProse website to your VPS server.

## 📋 Prerequisites

Before starting, ensure your VPS has:
- ✅ Ubuntu/Debian Linux (20.04+ recommended)
- ✅ Root or sudo access
- ✅ Domain name pointing to your VPS IP
- ✅ At least 2GB RAM
- ✅ Node.js 20+ installed
- ✅ Git installed

## 🔧 Step 1: Initial VPS Setup

### Connect to your VPS via SSH

```bash
ssh root@your_vps_ip
# or
ssh your_username@your_vps_ip
```

### Update system packages

```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Should show v20.x.x
npm --version
```

### Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### Install Nginx (Web Server)

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Install Git

```bash
sudo apt install git -y
```

## 🚀 Step 2: Clone and Setup Application

### Create application directory

```bash
sudo mkdir -p /var/www/vps-app
sudo chown -R $USER:$USER /var/www/vps-app
cd /var/www/vps-app
```

### Clone repository

```bash
git clone https://github.com/virtuprose/www.virtuprose.com.git .
```

### Install dependencies

```bash
npm ci
```

## 🔐 Step 3: Configure Environment Variables

### Create .env file

```bash
cp .env.example .env
nano .env
```

### Required Environment Variables

Edit the `.env` file with your actual values:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://virtuprose.com
PORT=3000

# OpenAI Configuration (Required for Orvia Chat)
OPENAI_API_KEY=sk-your-actual-openai-key-here

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Recipients
CONTACT_TO=info@virtuprose.com
CONTACT_FROM="VirtuProse Site" <your-email@gmail.com>
SUPPORT_INBOX=support@virtuprose.com
CUSTOM_PRICING_TO=info@virtuprose.com
LEAD_INBOX=info@virtuprose.com
```

**Important:** 
- For Gmail, you need to create an [App Password](https://support.google.com/accounts/answer/185833)
- OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

## 🏗️ Step 4: Build Application

```bash
cd /var/www/vps-app
npm run build
```

## 🔄 Step 5: Setup PM2 Process Manager

### Start application with PM2

```bash
cd /var/www/vps-app
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the instructions shown
```

### Useful PM2 Commands

```bash
pm2 status              # Check application status
pm2 logs vps-app        # View logs
pm2 restart vps-app     # Restart application
pm2 stop vps-app        # Stop application
pm2 monit               # Monitor resources
```

## 🌐 Step 6: Configure Nginx Reverse Proxy

### Create Nginx configuration

```bash
sudo nano /etc/nginx/sites-available/virtuprose.com
```

Copy the content from `nginx.conf.example` and update:
- Server name (your domain)
- SSL certificate paths (if using Let's Encrypt)

### Enable the site

```bash
sudo ln -s /etc/nginx/sites-available/virtuprose.com /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

## 🔒 Step 7: Setup SSL Certificate (Let's Encrypt)

### Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Obtain SSL certificate

```bash
sudo certbot --nginx -d virtuprose.com -d www.virtuprose.com
```

Follow the prompts. Certbot will automatically configure Nginx.

### Auto-renewal (automatic)

Certbot sets up auto-renewal automatically. Test with:

```bash
sudo certbot renew --dry-run
```

## 📦 Step 8: Deploy Using Deployment Script

### Make deploy script executable

```bash
chmod +x deploy.sh
```

### Run deployment

```bash
sudo ./deploy.sh
```

Or manually:

```bash
cd /var/www/vps-app
git pull origin main
npm ci
npm run build
pm2 reload ecosystem.config.js
```

## 🔍 Step 9: Verify Deployment

### Check application status

```bash
pm2 status
curl http://localhost:3000
```

### Check Nginx status

```bash
sudo systemctl status nginx
```

### Test your domain

Visit `https://virtuprose.com` in your browser.

## 📝 Common Commands Reference

### Application Management

```bash
# View logs
pm2 logs vps-app --lines 100

# Restart application
pm2 restart vps-app

# Rebuild and restart
cd /var/www/vps-app && npm run build && pm2 restart vps-app

# Check application
pm2 monit
```

### Nginx Management

```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# View error logs
sudo tail -f /var/log/nginx/virtuprose-error.log
```

### Firewall Setup (UFW)

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

## 🐛 Troubleshooting

### Application not starting

```bash
# Check logs
pm2 logs vps-app --err

# Check if port is in use
sudo lsof -i :3000

# Check environment variables
cd /var/www/vps-app && cat .env
```

### 502 Bad Gateway

```bash
# Check if Next.js is running
pm2 status

# Check if port 3000 is accessible
curl http://localhost:3000

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Build errors

```bash
# Clear cache and rebuild
cd /var/www/vps-app
rm -rf .next node_modules
npm ci
npm run build
```

### SSL Certificate issues

```bash
# Renew certificate manually
sudo certbot renew

# Check certificate expiration
sudo certbot certificates
```

## 🔄 Updating the Application

### Quick update (using deploy script)

```bash
cd /var/www/vps-app
sudo ./deploy.sh
```

### Manual update

```bash
cd /var/www/vps-app
git pull origin main
npm ci
npm run build
pm2 reload ecosystem.config.js
```

## 📊 Monitoring

### Setup monitoring (optional)

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Health check endpoint

Your application is accessible at `http://localhost:3000` for health checks.

## 🔐 Security Checklist

- [ ] Firewall configured (UFW)
- [ ] SSH key authentication enabled
- [ ] SSL certificate installed and auto-renewing
- [ ] Environment variables secured (.env file)
- [ ] PM2 running with correct user permissions
- [ ] Nginx security headers configured
- [ ] Regular system updates scheduled

## 📞 Support

If you encounter issues:
1. Check application logs: `pm2 logs vps-app`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify environment variables are set correctly
4. Ensure all required ports are open

## 🎉 Success!

Your VirtuProse website should now be live at `https://virtuprose.com`!

