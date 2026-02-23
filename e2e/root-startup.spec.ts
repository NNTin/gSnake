import { test, expect } from '@playwright/test';

const STARTUP_ERROR_TITLE = 'Level Load Failed';
const STARTUP_ERROR_MESSAGE = 'Failed to initialize game engine. Please reload and try again.';

test.describe('Root startup regression guard', () => {
  test('loads / into a playable state without startup initialization errors', async ({ page }) => {
    test.setTimeout(20_000);

    await page.goto('/');

    const loadingIndicator = page.locator('[data-element-id="engine-loading-indicator"]');
    const gridCells = page.locator('[data-element-id="game-field"] .cell');
    const levelDisplay = page.locator('[data-element-id="level-display"]');
    const startupErrorTitle = page.getByText(STARTUP_ERROR_TITLE, { exact: true });
    const startupErrorMessage = page.getByText(STARTUP_ERROR_MESSAGE, { exact: true });

    await expect
      .poll(
        async () => {
          const levelText = ((await levelDisplay.textContent()) ?? '').trim();

          return {
            loadingVisible: await loadingIndicator.isVisible().catch(() => false),
            hasPlayableGrid: (await gridCells.count()) > 0,
            hasLevelNumber: /^\d+$/.test(levelText),
            startupErrorTitleCount: await startupErrorTitle.count(),
            startupErrorMessageCount: await startupErrorMessage.count(),
          };
        },
        {
          timeout: 15_000,
        }
      )
      .toEqual({
        loadingVisible: false,
        hasPlayableGrid: true,
        hasLevelNumber: true,
        startupErrorTitleCount: 0,
        startupErrorMessageCount: 0,
      });
  });
});
