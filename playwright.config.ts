import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: ['**/*.spec.ts'],
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
  webServer: [
    {
      command:
        './scripts/build_fixture_wasm.sh && rm -rf gsnake-web/node_modules/gsnake-wasm && cp -R e2e/fixtures/gsnake-wasm/pkg gsnake-web/node_modules/gsnake-wasm && npm --prefix gsnake-web run build && npm --prefix gsnake-web run preview -- --port 3000 --strictPort',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: 'npm --prefix gsnake-editor run dev',
      url: 'http://localhost:3003',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
});
