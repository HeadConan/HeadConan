import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      include: ['src/routing/**'],
      thresholds: { lines: 85, branches: 80 },
    },
  },
});
