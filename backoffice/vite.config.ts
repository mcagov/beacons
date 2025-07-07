import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  base: "/backoffice",
  plugins: [react(), svgr(), tsconfigPaths()],
  server: {
    open: true,
    port: 3001,
    proxy: {
      "/backoffice/client-id": "http://localhost:3005",
      "/backoffice/tenant-id": "http://localhost:3005",
      "/backoffice/log": "http://localhost:3005",
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
