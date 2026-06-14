module.exports = {
  apps: [
    {
      name: "hongyuan",
      cwd: __dirname,
      script: "dist/server.cjs",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3000,
        RFQ_ADMIN_USER: process.env.RFQ_ADMIN_USER || "admin",
        RFQ_ADMIN_PASSWORD: process.env.RFQ_ADMIN_PASSWORD,
        RFQ_DATA_DIR: process.env.RFQ_DATA_DIR,
      },
    },
  ],
};
