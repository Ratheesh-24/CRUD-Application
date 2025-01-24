import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // Required for React testing
    setupFiles: './vitest.setup.js', // Optional setup file
  },
});
