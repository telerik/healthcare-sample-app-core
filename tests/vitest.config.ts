import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        testTimeout: 10000,
        hookTimeout: 10000,
        fileParallelism: true,
        maxWorkers: 2,
        include: ['src/**/*.test.ts'],
        globalSetup: ['src/global-teardown.ts'],
        env: {
            BROWSER_WIDTH: '1920',
            BROWSER_HEIGHT: '1080',
        },
    },
});
