import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
  const api_url =
    command === "build"
      ? "http://insert_prod_url_here"
      : "http://localhost:8000";

  console.log(api_url);
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    envDir: "../",
    server: {
      proxy: {
        "/api": {
          target: api_url,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          secure: command === "build",
        },
      },
    },
  };
});
