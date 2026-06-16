module.exports = {
  apps: [
    {
      name: "hongyuan",
      cwd: __dirname,
      script: "dist/server.cjs",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3000,
        ADMIN_USER: process.env.ADMIN_USER || process.env.RFQ_ADMIN_USER || "admin",
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || process.env.RFQ_ADMIN_PASSWORD,
        ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
        RFQ_ADMIN_USER: process.env.RFQ_ADMIN_USER || "admin",
        RFQ_ADMIN_PASSWORD: process.env.RFQ_ADMIN_PASSWORD,
        RFQ_DATA_DIR: process.env.RFQ_DATA_DIR,
      },
    },
  ],
};
