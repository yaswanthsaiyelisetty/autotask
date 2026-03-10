#!/bin/bash
# ═══════════════════════════════════════════════════════
# AutoTask – Azure VM Setup Script
# Run this on a fresh Ubuntu 22.04 Azure VM (B2ats v2)
# ═══════════════════════════════════════════════════════

set -e

echo "══════════════════════════════════════"
echo "  AutoTask – Azure VM Setup"
echo "══════════════════════════════════════"

# ── 1. System Update ──
echo "📦 Updating system..."
sudo apt update && sudo apt upgrade -y

# ── 2. Install Node.js 20 LTS ──
echo "📦 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# ── 3. Install Nginx ──
echo "📦 Installing Nginx..."
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# ── 4. Install PM2 (Process Manager) ──
echo "📦 Installing PM2..."
sudo npm install -g pm2

# ── 5. Install Git ──
echo "📦 Installing Git..."
sudo apt install -y git

# ── 6. Install Certbot (SSL) ──
echo "📦 Installing Certbot for SSL..."
sudo apt install -y certbot python3-certbot-nginx

# ── 7. Create app directory ──
echo "📁 Setting up application directory..."
sudo mkdir -p /var/www/autotask
sudo chown -R $USER:$USER /var/www/autotask

# ── 8. Firewall ──
echo "🔥 Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo ""
echo "══════════════════════════════════════"
echo "  ✅ VM Setup Complete!"
echo "══════════════════════════════════════"
echo ""
echo "Next steps:"
echo "  1. Clone your repo:  cd /var/www/autotask && git clone <your-repo-url> ."
echo "  2. Install deps:     npm run install:all"
echo "  3. Create .env:      cp .env.example server/.env && nano server/.env"
echo "  4. Build frontend:   cd client && npm run build"
echo "  5. Copy nginx config: sudo cp deploy/nginx.conf /etc/nginx/sites-available/autotask"
echo "  6. Enable nginx site: sudo ln -s /etc/nginx/sites-available/autotask /etc/nginx/sites-enabled/"
echo "  7. Remove default:    sudo rm /etc/nginx/sites-enabled/default"
echo "  8. Test nginx:        sudo nginx -t && sudo systemctl reload nginx"
echo "  9. Start app:         pm2 start deploy/ecosystem.config.js"
echo " 10. Save PM2:          pm2 save && pm2 startup"
echo " 11. SSL (optional):    sudo certbot --nginx -d yourdomain.com"
echo ""
