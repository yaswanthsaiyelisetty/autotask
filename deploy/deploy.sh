#!/bin/bash
# ═══════════════════════════════════════════════════════
# AutoTask – Deploy / Update Script
# Run this on the Azure VM to deploy or update the app
# ═══════════════════════════════════════════════════════

set -e

APP_DIR="/var/www/autotask"

echo "══════════════════════════════════════"
echo "  AutoTask – Deploying..."
echo "══════════════════════════════════════"

cd "$APP_DIR"

# ── Pull latest code ──
echo "📥 Pulling latest code..."
git pull origin main

# ── Install dependencies ──
echo "📦 Installing dependencies..."
npm run install:all

# ── Build frontend ──
echo "🔨 Building React frontend..."
cd client
npm run build
cd ..

# ── Create logs directory ──
mkdir -p logs

# ── Restart server ──
echo "♻️  Restarting server..."
pm2 restart autotask || pm2 start deploy/ecosystem.config.js

# ── Reload Nginx ──
echo "♻️  Reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "══════════════════════════════════════"
echo "  ✅ Deployment Complete!"
echo "══════════════════════════════════════"
echo ""
echo "Check status:  pm2 status"
echo "View logs:     pm2 logs autotask"
echo "Health check:  curl http://localhost:5000/api/health"
echo ""
