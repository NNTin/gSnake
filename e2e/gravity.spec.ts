import { test, expect } from '@playwright/test';

test.describe('Gravity Mechanics', () => {
  test('Snake falls when walking off a ledge', async ({ page }) => {
    // 1. Setup: Load "Level 2: The Drop"
    await page.goto('/?level=2');
    
    // Verification: Assert snake head is at start position (2, 2)
    // The grid is 15x15. Index = y * 15 + x.
    // Head (2, 2) -> Index 32.
    await expect(page.locator('[data-element-id="level-display"]')).toHaveText('2');
    
    // Get all cells
    const cells = page.locator('.cell');
    
    // Helper to check position
    const expectHeadAt = async (x: number, y: number) => {
      const index = y * 15 + x;
      await expect(cells.nth(index)).toHaveClass(/snake-head/);
    };

    await expectHeadAt(2, 2);

    // 2. Action - Move to Ledge (x=3)
    // Snake head starts at 2. Ledge ends at 3.
    // Press Right once: Head moves to 3.
    await page.keyboard.press('ArrowRight');
    await expectHeadAt(3, 2); // Still on platform
    
    // 3. Action - Walk Off Ledge
    // We need to move enough steps so the entire body (length 3) clears the support.
    // Platform is at x=0,1,2,3.
    // Head at 3. Body at 2, 1.
    
    // Move Right (Head 4): Body at 3, 2. Tail (2) supported.
    await page.keyboard.press('ArrowRight');
    await expectHeadAt(4, 2);

    // Move Right (Head 5): Body at 4, 2. Tail (3) supported by obstacle at (3,3).
    await page.keyboard.press('ArrowRight');
    await expectHeadAt(5, 2);
    
    // Move Right (Head 6): Body at 5, 2. Tail (4) has NO support below (4,3 is empty).
    // GRAVITY should apply instantly.
    // The snake falls down until it hits an obstacle, floor, or food.
    // In Level 2, obstacles are at y=7. Food is at (5, 6).
    // The snake segment at x=5 will be blocked by the food at (5, 6).
    // Therefore, the snake stops falling when the segments reach y=5.
    // Final Head Position: (6, 5).
    await page.keyboard.press('ArrowRight');

    // 5. Validation
    // Assert Snake Head is NOT at the y-level of the ledge (y=2)
    // Assert Snake Head has landed on the platform formed by food (y=5)
    await expectHeadAt(6, 5);
  });
});