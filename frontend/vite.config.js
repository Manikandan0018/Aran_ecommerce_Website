import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
    tailwindcss(),
  ],

  build: {
    target: "esnext",
    minify: "esbuild", // fastest + smallest
    sourcemap: false, // disable in production for speed

    rollupOptions: {
      output: {
        manualChunks: {
          reactVendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          icons: ["react-icons"],
          toast: ["react-toastify"],
          google: ["@react-oauth/google"],
        },
      },
    },

    chunkSizeWarningLimit: 1000,
  },

  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },

  server: {
    port: 5173,
    open: true,
  },
});
