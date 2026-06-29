module.exports = {
  apps: [
    {
      name: "mcat-air-drawing",
      script: "dist/server.cjs",
      instances: 1, // Single instance is ideal for web socket / lightweight environments, change to 'max' for high-traffic multi-core setup
      exec_mode: "fork",
      watch: false, // watch mode is not recommended in production; use pm2 reload/restart
      max_memory_restart: "300M", // restarts the application if it exceeds 300MB memory usage
      env: {
        NODE_ENV: "production",
        PORT: 3000
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000 // You can change this port to whatever your server structure requires
      },
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true
    }
  ]
};
