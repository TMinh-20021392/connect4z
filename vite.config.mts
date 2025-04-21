import { defineConfig } from "vite";
import zaloMiniApp from "zmp-vite-plugin";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    root: "./src",
    base: "",
    plugins: [zaloMiniApp(), react()],
    build: {
      assetsInlineLimit: 0,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './setupTests.ts', // Adjusted to match the root
      include: ['**/*.test.{js,jsx,ts,tsx}'], // Match test files in all subdirectories
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  });
};
