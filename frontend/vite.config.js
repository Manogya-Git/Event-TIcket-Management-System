import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/events": "http://127.0.0.1:8000",
      "/tickets": "http://127.0.0.1:8000",
      "/category": "http://127.0.0.1:8000",
      "/media": "http://127.0.0.1:8000",
    },
  },
});
