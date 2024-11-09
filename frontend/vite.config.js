import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000", // Target your backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api/v1"), // Ensure the correct API version
      },
    },
  },
});
