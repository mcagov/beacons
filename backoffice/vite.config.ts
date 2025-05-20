import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()],
  server: {
    open: true,
    port: 3001,
    proxy: {
      "/backoffice": "http://localhost:3005",
    },
  },
  define: {
    "process.env": {},
  },
  build: {
    outDir: "build",
    emptyOutDir: true,
  },
});
