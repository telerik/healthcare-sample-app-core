import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        testTimeout: 60000,
        hookTimeout: 30000,
        fileParallelism: true,
        maxWorkers: 2,
        include: ['src/**/*.test.ts'],
        globalSetup: ['src/global-teardown.ts'],
    },
});
