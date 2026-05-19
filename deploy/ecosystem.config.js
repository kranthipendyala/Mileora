/**
 * PM2 ecosystem for the Next.js web tier in production.
 * Run with: pm2 start ecosystem.config.js --env production
 *
 * The CodeIgniter API is served by Apache/Nginx + PHP-FPM, not PM2.
 * See apache-proxy.conf for the front-end proxy that routes
 *   /api/* → PHP-FPM (CodeIgniter)
 *   /*     → Node (Next.js on port 3000)
 */
module.exports = {
  apps: [
    {
      name: "mileora-web",
      cwd: "/var/www/mileora/web",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: "max",          // one process per CPU core
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env_production: {
        NODE_ENV: "production",
        PORT: "3000",
        NEXT_TELEMETRY_DISABLED: "1",
      },
      error_file: "/var/log/mileora/web-error.log",
      out_file:   "/var/log/mileora/web-out.log",
      merge_logs: true,
      time: true,
    },
  ],

  deploy: {
    production: {
      user: "deploy",
      host: ["mileora.com"],
      ref: "origin/main",
      repo: "git@github.com:kranthipendyala/Mileora.git",
      path: "/var/www/mileora",
      "post-deploy":
        "cd web && npm ci --omit=dev && npm run build && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "sudo mkdir -p /var/log/mileora && sudo chown deploy:deploy /var/log/mileora",
    },
  },
};
