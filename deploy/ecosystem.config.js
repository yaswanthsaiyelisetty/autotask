// ═══════════════════════════════════════
// AutoTask – PM2 Ecosystem Config
// ═══════════════════════════════════════
// Start:   pm2 start deploy/ecosystem.config.js
// Monitor: pm2 monit
// Logs:    pm2 logs autotask
// Restart: pm2 restart autotask

module.exports = {
  apps: [
    {
      name: 'autotask',
      cwd: './server',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M', // B2ats v2 has 1 GB RAM – keep Node under 300 MB
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/www/autotask/logs/error.log',
      out_file: '/var/www/autotask/logs/output.log',
      merge_logs: true,
      // Graceful restart
      kill_timeout: 5000,
      listen_timeout: 10000,
    },
  ],
};
