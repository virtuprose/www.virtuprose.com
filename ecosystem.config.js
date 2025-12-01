// PM2 Ecosystem Configuration for VPS Deployment
module.exports = {
  apps: [
    {
      name: "virtuprose-com",
      script: "npm",
      args: "start",
      cwd: "/www/wwwroot/virtuprose.com",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      max_memory_restart: "1G",
      watch: false,
      ignore_watch: ["node_modules", ".next", "logs"],
    },
  ],
};

