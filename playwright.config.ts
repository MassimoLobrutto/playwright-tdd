import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

export default defineConfig({
  // 1. Point directly to your tests folder
  testDir: './src/specs',

  // 2. Keep your Auth Setup (Vanilla PW handles this natively)
  globalSetup: require.resolve('./src/auth.setup.ts'),

  fullyParallel: true,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 4 : 3,

  // 3. Use standard Playwright reporters (No more Cucumber bloat)
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'], // Great for seeing real-time progress in the terminal
  ],

  use: {
    baseURL: 'https://jsonplaceholder.typicode.com',
    screenshot: process.env.CI ? 'only-on-failure' : 'off',
    trace: 'on-first-retry', // Professional tip: trace only when things go wrong
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.resolve(__dirname, 'src/.auth/sauce_user.json'),
      },
      // 4. Update the matcher to find standard spec files
      testMatch: /.*\.spec\.ts/,
    },
  ],
});
