import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy route for WordPress API to bypass CORS
  app.get("/api/posts", async (req, res) => {
    try {
      const wpApiUrl = process.env.VITE_WP_API_URL || 'https://api.hongyuan-precision.com/wp-json/wp/v2/posts';
      
      const response = await fetch(`${wpApiUrl}?_embed&per_page=100`);
      
      if (!response.ok) {
        throw new Error(`WordPress API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Error proxying WP request:", error);
      res.status(500).json({ error: error.message || "Failed to fetch from WordPress" });
    }
  });

  app.get("/api/posts/:slug", async (req, res) => {
    try {
      const wpApiUrl = process.env.VITE_WP_API_URL || 'https://api.hongyuan-precision.com/wp-json/wp/v2/posts';
      
      const response = await fetch(`${wpApiUrl}?slug=${req.params.slug}&_embed`);
      
      if (!response.ok) {
        throw new Error(`WordPress API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data && data.length > 0) {
        res.json(data[0]);
      } else {
        res.status(404).json({ error: "Post not found" });
      }
    } catch (error: any) {
      console.error("Error proxying single post request:", error);
      res.status(500).json({ error: error.message || "Failed to fetch post from WordPress" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files from dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
