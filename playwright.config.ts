import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'artifacts/playwright-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'artifacts/allure-results' }],
  ],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    video: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command:
      './scripts/build_fixture_wasm.sh && rm -rf gsnake-web/node_modules/gsnake-wasm && cp -R e2e/fixtures/gsnake-wasm/pkg gsnake-web/node_modules/gsnake-wasm && npm --prefix gsnake-web run build && npm --prefix gsnake-web run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});
