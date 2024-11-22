import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {},
    // proxy: {
    //   "/api": {
    //     target: "https://yt-backend-lo6n.onrender.com", // Target your backend server
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, "/api/v1"), // Ensure the correct API version
    //   },
    // },
  },
});
