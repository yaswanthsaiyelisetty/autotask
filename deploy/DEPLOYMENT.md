# AutoTask – Azure Deployment Guide

Complete guide to deploy AutoTask on your **Azure Free Tier** using:

| Service | Azure Free Tier | Monthly Limit |
|---------|----------------|---------------|
| **VM** | B2ats v2 (Linux) | 750 hours/month |
| **Database** | Cosmos DB (MongoDB API) | 25 GB + 1000 RU/s |
| **Public IP** | Standard | 1,500 hours |
| **Data Transfer** | Outbound | 15 GB |

---

## Step 1 – Create Azure Cosmos DB (Free Tier)

This replaces MongoDB Atlas. **Zero code changes** required.

### 1.1 Create Cosmos DB Account

1. Go to [Azure Portal](https://portal.azure.com)
2. Search **"Azure Cosmos DB"** → Click **Create**
3. Select **Azure Cosmos DB for MongoDB** (RU-based)
4. Fill in:
   - **Subscription**: Your free subscription
   - **Resource Group**: Create new → `autotask-rg`
   - **Account Name**: `autotask-db` (must be globally unique)
   - **Location**: Choose nearest to your users (e.g., Central India)
   - **Capacity mode**: Serverless or **Provisioned** (select Free Tier ✅)
5. Click **Review + Create** → **Create**

### 1.2 Get Connection String

1. Go to your Cosmos DB account
2. **Settings** → **Connection strings**
3. Copy the **PRIMARY CONNECTION STRING**
4. Replace `<password>` in the string with your actual password
5. Add the database name `autotask` before the `?` in the connection string:

```
mongodb://autotask-db:<key>@autotask-db.mongo.cosmos.azure.com:10255/autotask?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@autotask-db@
```

### 1.3 Create Database and Collections

1. In Cosmos DB → **Data Explorer**
2. Click **New Database** → Name: `autotask`
3. Click **New Collection** under `autotask`:
   - Collection: `users` → Shard key: `_id`
   - Collection: `tasks` → Shard key: `userId`

> Collections will also be created automatically when the app first writes data.

---

## Step 2 – Create Azure VM (Free Tier)

### 2.1 Create the VM

1. Azure Portal → **Virtual Machines** → **Create**
2. Fill in:
   - **Resource Group**: `autotask-rg`
   - **VM Name**: `autotask-vm`
   - **Region**: Same as Cosmos DB
   - **Image**: Ubuntu Server 22.04 LTS
   - **Size**: **B2ats v2** (free tier – 2 vCPU, 1 GB RAM)
   - **Authentication**: SSH public key (recommended) or password
   - **Username**: `azureuser`
3. **Networking tab**:
   - Public IP: Create new (Standard SKU, Static)
   - Inbound ports: Allow **SSH (22)**, **HTTP (80)**, **HTTPS (443)**
4. Click **Review + Create** → **Create**
5. Download the SSH key (.pem file) if you chose SSH key auth

### 2.2 Configure Network Security Group (NSG)

1. Go to VM → **Networking** → **Add inbound port rule**
2. Make sure these ports are open:

| Port | Protocol | Purpose |
|------|----------|---------|
| 22   | TCP      | SSH     |
| 80   | TCP      | HTTP    |
| 443  | TCP      | HTTPS   |

### 2.3 Note Your Public IP

Go to VM → **Overview** → Copy the **Public IP address**
(e.g., `20.204.xxx.xxx`)

---

## Step 3 – SSH into the VM

```bash
# If using SSH key:
chmod 400 autotask-vm_key.pem
ssh -i autotask-vm_key.pem azureuser@<YOUR_PUBLIC_IP>

# If using password:
ssh azureuser@<YOUR_PUBLIC_IP>
```

---

## Step 4 – Run the VM Setup Script

```bash
# Clone your repository
cd /var/www
sudo mkdir -p autotask
sudo chown -R $USER:$USER autotask
git clone https://github.com/yourusername/autotask.git autotask
cd autotask

# Make setup script executable and run it
chmod +x deploy/setup-vm.sh
./deploy/setup-vm.sh
```

This installs: Node.js 20, Nginx, PM2, Git, Certbot, and configures the firewall.

---

## Step 5 – Configure the App

### 5.1 Install Dependencies

```bash
cd /var/www/autotask
npm run install:all
```

### 5.2 Create Environment File

```bash
cp .env.example server/.env
nano server/.env
```

Fill in your actual values:

```env
NODE_ENV=production
PORT=5000

# Azure Cosmos DB connection string (from Step 1.2)
MONGO_URI=mongodb://autotask-db:<key>@autotask-db.mongo.cosmos.azure.com:10255/autotask?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@autotask-db@
AZURE_COSMOS=true

JWT_SECRET=<generate-a-random-64-char-string>
JWT_EXPIRES_IN=7d

OPENAI_API_KEY=sk-your-openai-key
TWILIO_ACCOUNT_SID=AC-your-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_WHATSAPP_NUMBER=+14155238886

CLIENT_URL=http://<YOUR_PUBLIC_IP>
```

> **Generate JWT_SECRET**: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 5.3 Build the Frontend

```bash
cd client
npm run build
cd ..
```

---

## Step 6 – Configure Nginx

```bash
# Copy the nginx config
sudo cp deploy/nginx.conf /etc/nginx/sites-available/autotask

# Edit it – replace 'yourdomain.com' with your IP or domain
sudo nano /etc/nginx/sites-available/autotask
# Change: server_name yourdomain.com;
# To:     server_name <YOUR_PUBLIC_IP>;

# Enable the site
sudo ln -s /etc/nginx/sites-available/autotask /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 7 – Start the Application with PM2

```bash
cd /var/www/autotask

# Create logs directory
mkdir -p logs

# Start the app
pm2 start deploy/ecosystem.config.js

# Verify it's running
pm2 status
pm2 logs autotask

# Set PM2 to start on system boot
pm2 save
pm2 startup
# (run the command it shows you with sudo)
```

---

## Step 8 – Verify Deployment

```bash
# Health check
curl http://localhost:5000/api/health

# Should return:
# {"status":"ok","environment":"production","timestamp":"..."}
```

Now open your browser: `http://<YOUR_PUBLIC_IP>`

---

## Step 9 – Set Up SSL/HTTPS (Optional but Recommended)

### Option A: With a Domain Name

1. Point your domain's DNS A record to your VM's public IP
2. Run Certbot:

```bash
sudo certbot --nginx -d yourdomain.com
```

3. Update `.env`:
```env
CLIENT_URL=https://yourdomain.com
```

4. Restart the app:
```bash
pm2 restart autotask
```

### Option B: Without a Domain (Self-Signed – Dev Only)

```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/autotask.key \
  -out /etc/ssl/certs/autotask.crt
```

Then update the nginx config to use these certificates.

---

## Step 10 – Configure Twilio Webhook

1. Go to [Twilio Console](https://console.twilio.com)
2. Navigate to **Messaging** → **Try it out** → **Send a WhatsApp message**
3. Set the **Sandbox webhook URL**:
   ```
   http://<YOUR_PUBLIC_IP>/api/whatsapp/webhook
   ```
   or with SSL:
   ```
   https://yourdomain.com/api/whatsapp/webhook
   ```
4. Method: **POST**

---

## Updating the App

After pushing code changes to GitHub:

```bash
cd /var/www/autotask
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

---

## Useful PM2 Commands

| Command | Description |
|---------|-------------|
| `pm2 status` | Check app status |
| `pm2 logs autotask` | View live logs |
| `pm2 logs autotask --lines 100` | View last 100 log lines |
| `pm2 restart autotask` | Restart the app |
| `pm2 stop autotask` | Stop the app |
| `pm2 monit` | Real-time monitoring |

---

## Azure Cost Summary

With the free tier, your monthly cost should be **$0** for:

| Resource | Free Limit | AutoTask Usage | Cost |
|----------|-----------|---------------|------|
| VM B2ats v2 | 750 hrs | ~730 hrs (24/7) | $0 |
| Cosmos DB Storage | 25 GB | < 1 GB | $0 |
| Cosmos DB RU/s | 1000 RU/s | ~50-100 RU/s | $0 |
| Public IP | 1,500 hrs | ~730 hrs | $0 |
| Data Transfer | 15 GB | < 5 GB | $0 |

**External services (not Azure):**
- OpenAI API: Pay-per-use (~$0.002/request with GPT-3.5)
- Twilio WhatsApp: ~$0.005/message (free sandbox available for testing)

---

## Troubleshooting

### App not starting
```bash
pm2 logs autotask --lines 50
# Check for missing env vars or connection errors
```

### Cosmos DB connection error
- Verify the connection string in `server/.env`
- Make sure `AZURE_COSMOS=true` is set
- Check Azure Cosmos DB firewall rules (allow the VM's IP)

### Nginx 502 Bad Gateway
```bash
# Check if Node.js is running
pm2 status
# Restart if needed
pm2 restart autotask
```

### Port 80 not reachable
- Check Azure NSG rules (Networking tab in VM)
- Check UFW: `sudo ufw status`
