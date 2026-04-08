/// <reference types="vitest" />

import angular from "@analogjs/vite-plugin-angular";

import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [angular()],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["src/test-setup.ts"],
      include: ["**/*.spec.ts"],
      exclude: ["node_modules", "dist", "e2e"],
      reporters: ["default"],
      coverage: {
        provider: "v8",
        include: ["src/app/core/**", "src/app/shared/**"],
        thresholds: {
          lines: 65,
          branches: 55,
          functions: 55,
          statements: 65,
        },
      },
    },
    define: {
      "import.meta.vitest": mode !== "production",
    },
  };
});
