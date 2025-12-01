# Quick Deployment Instructions for VirtuProse.com

## 🚀 Method 1: One-Command Deployment (Easiest)

Connect to your VPS and run this single command:

```bash
ssh root@31.97.213.79
# Enter password when prompted: 69984942@Abeer

# Once connected, run:
cd /www/wwwroot && mkdir -p virtuprose.com && cd virtuprose.com && git clone https://github.com/virtuprose/www.virtuprose.com.git . && cp .env.production .env 2>/dev/null || cp .env.example .env && npm ci && npm run build && npm install -g pm2 && PORT=3001 pm2 start npm --name "virtuprose-com" -- start && pm2 save
```

## 🚀 Method 2: Step-by-Step Deployment

### Step 1: Connect to VPS
```bash
ssh root@31.97.213.79
# Password: 69984942@Abeer
```

### Step 2: Navigate to directory
```bash
cd /www/wwwroot
mkdir -p virtuprose.com
cd virtuprose.com
```

### Step 3: Clone repository
```bash
git clone https://github.com/virtuprose/www.virtuprose.com.git .
```

### Step 4: Setup environment
```bash
# Copy your environment variables
cp .env.production .env

# Or create .env manually
nano .env
# Add: PORT=3001
```

### Step 5: Install dependencies
```bash
npm ci
```

### Step 6: Build application
```bash
npm run build
```

### Step 7: Install PM2 (if not installed)
```bash
npm install -g pm2
```

### Step 8: Start application
```bash
PORT=3001 pm2 start npm --name "virtuprose-com" -- start
pm2 save
```

### Step 9: Verify
```bash
pm2 status
curl http://localhost:3001
```

## 🔧 Method 3: Upload and Run Deployment Script

1. **Upload the script** to your VPS:
```bash
# From your local machine:
scp vps-deploy-complete.sh root@31.97.213.79:/root/
```

2. **Connect and run**:
```bash
ssh root@31.97.213.79
chmod +x /root/vps-deploy-complete.sh
bash /root/vps-deploy-complete.sh
```

## 📝 Important Notes

- ✅ Application will run on **port 3001** (safe, won't conflict with orviahq.cloud)
- ✅ Directory: `/www/wwwroot/virtuprose.com`
- ✅ PM2 app name: `virtuprose-com`
- ✅ Uses `.env.production` file you already created

## ⚠️ Next Steps After Deployment

1. **Configure Nginx** for virtuprose.com domain
2. **Set up SSL** certificate
3. **Test** the application

