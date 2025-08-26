import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import type { OutputAsset } from "rollup"; // For proper typing

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    hmr: {
      host: process.env.PUBLIC_HOST || "localhost",
      port: 5173,
    },
    allowedHosts: [
      "localhost",
      process.env.PUBLIC_HOST,
      ".azurecontainerapps.io"
    ].filter(Boolean),
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo: OutputAsset) => {
          const ext = path.extname(assetInfo.name || "").toLowerCase();

          // Images
          if (/\.(png|jpe?g|gif|svg|webp|bmp|tiff?)$/.test(ext)) {
            return "assets/images/[name]-[hash][extname]";
          }

          // Icons
          if (/\.(ico|svg)$/.test(ext)) {
            return "assets/icons/[name]-[hash][extname]";
          }

  
        },
      },
    },
  },
});
