require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { startScheduler } = require('./services/scheduler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(
  cors({
    origin: isProduction
      ? process.env.CLIENT_URL
      : process.env.CLIENT_URL || 'http://localhost:5173',
  })
);
app.use(express.json());

// Twilio webhook needs urlencoded body parsing
app.use('/api/whatsapp', express.urlencoded({ extended: false }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ── Production: serve React build ──
if (isProduction) {
  const clientBuild = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientBuild));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
}

// Error handler
app.use(errorHandler);

// Start server
async function start() {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 AutoTask server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
  startScheduler();
}

start();
