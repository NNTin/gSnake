import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: ['**/*.spec.ts'],
  globalSetup: './e2e/global-setup.ts',
  // do NOT increase this timeout, if increased timeout is needed set per-test via test.setTimeout(...)
  // if possible, decrease this timeout to make sure tests are fast
  timeout: 5000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'artifacts/playwright-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'artifacts/allure-results' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.CI
    ? undefined // In CI, servers are started in workflow steps
    : [
        // Local development: start servers automatically
        {
          command: 'npm --prefix gsnake-web run preview -- --port 3000 --strictPort',
          url: 'http://localhost:3000',
          reuseExistingServer: true,
          timeout: 120000,
        },
        {
          command: 'npm --prefix gsnake-editor run dev:editor',
          url: 'http://localhost:3003',
          reuseExistingServer: true,
          timeout: 120000,
        },
        {
          command: 'npm --prefix gsnake-editor run dev:server',
          url: 'http://localhost:3001/health',
          reuseExistingServer: true,
          timeout: 120000,
        },
      ],
});
