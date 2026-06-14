module.exports = {
  apps: [
    {
      name: "hongyuan",
      cwd: __dirname,
      script: "dist/server.cjs",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3000,
      },
    },
  ],
};
