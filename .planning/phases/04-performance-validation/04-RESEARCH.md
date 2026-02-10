# Phase 4: Performance & Validation - Research

**Researched:** 2026-02-10
**Domain:** Performance profiling, visual regression testing, and 60fps validation for SVG-based web game rendering
**Confidence:** HIGH

## Summary

Phase 4 validates that the SVG visual upgrade maintains smooth 60fps performance and renders correctly across all game object combinations. The phase employs three validation strategies: (1) Chrome DevTools Performance profiling to measure frame times and identify rendering bottlenecks, (2) manual testing with Performance Monitor for real-time FPS tracking during gameplay, and (3) visual regression testing using screenshot comparisons to verify SVG rendering quality.

The project already has Vitest installed for unit testing, providing a foundation for automated screenshot capture. Chrome DevTools Performance tab measures frame times against the 16.67ms budget for 60fps, while the Performance Monitor panel provides real-time metrics for CPU usage, DOM node count, and layouts per second. For visual regression testing, Playwright offers the most robust solution with built-in screenshot comparison via `toHaveScreenshot()`, though manual screenshot comparison is also viable for this single-milestone upgrade.

Success validation focuses on three dimensions: performance (frame times under 16.67ms during rapid updates), correctness (all CellType combinations render as expected SVGs), and efficiency (will-change CSS hints applied only to animated elements). The current implementation already follows performance best practices from Phase 3 research (primitive props, CSS transforms, proper cleanup), so Phase 4 primarily validates these decisions and catches any regressions.

**Primary recommendation:** Use Chrome DevTools Performance tab to record and analyze gameplay sessions with falling objects and snake movement, manually test with Performance Monitor to observe real-time FPS and DOM metrics during a 30-second stress test level, and create visual regression baselines by capturing screenshots of all CellType objects before/after the visual upgrade for quality assurance.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Chrome DevTools | Built-in (v120+) | Performance profiling, frame time analysis, memory monitoring | Industry standard for web performance debugging, provides FPS charts, flame graphs, and heap snapshots |
| Performance Monitor | Built-in DevTools | Real-time FPS, DOM nodes, CPU usage tracking | Built-in panel for continuous performance monitoring during user interactions |
| Vitest | 1.6.1 (existing) | Test runner for automated validation | Already installed in project, provides jsdom environment for DOM testing |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Playwright | Latest (1.48+) | Visual regression testing with screenshot comparison | If automated visual regression testing is desired (optional for single milestone) |
| jsdom | 24.1.3 (existing) | Headless DOM for screenshot capture | Already installed, can capture DOM state for manual comparison |
| pixelmatch | Built-in Playwright | Pixel-level screenshot comparison | Included with Playwright's toHaveScreenshot() assertion |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Chrome DevTools | Firefox DevTools, Safari Web Inspector | Chrome has best SVG profiling tools and is primary target browser per PROJECT.md |
| Playwright | Puppeteer, BackstopJS | Puppeteer Chrome-only, BackstopJS adds complexity for single-milestone validation |
| Manual screenshots | Automated Playwright tests | Manual sufficient for one-time upgrade validation, automation better for ongoing regression testing |
| Performance Monitor | Lighthouse CI | Lighthouse for comprehensive audits, Monitor for interactive gameplay testing |

**Installation (if adding Playwright):**

```bash
npm install --save-dev playwright
npx playwright install chromium
```

**Note:** Playwright is optional. Chrome DevTools + manual testing sufficient for this phase's requirements.

## Architecture Patterns

### Recommended Testing Structure

```
gsnake-web/
├── tests/
│   ├── performance/
│   │   └── fps-validation.manual.md    # Manual test procedure for 60fps validation
│   └── visual/
│       ├── baselines/                  # Reference screenshots (before upgrade)
│       │   ├── SnakeHead.png
│       │   ├── Food.png
│       │   └── ...
│       └── current/                    # Current screenshots (after upgrade)
├── .planning/
│   └── phases/
│       └── 04-performance-validation/
│           ├── 04-RESEARCH.md          # This file
│           ├── 04-PLAN.md              # Validation tasks
│           └── devtools-screenshots/   # Performance profiling evidence
└── vite.config.ts                      # Existing Vite configuration
```

### Pattern 1: Chrome DevTools Performance Recording for Frame Time Analysis

**What:** Record gameplay sessions using the Performance tab to capture frame times, identify long tasks (>50ms), and validate 60fps consistency during rapid game updates.

**When to use:** Validating performance during snake movement, falling objects, and level transitions.

**Example:**

```markdown
# Manual Performance Profiling Procedure

1. Open Chrome DevTools (F12) > Performance tab
2. Click "Record" (red circle) button
3. Perform gameplay actions:
   - Move snake rapidly (arrow keys)
   - Let falling objects drop (gravity events)
   - Collect food (frame updates)
4. After 10-15 seconds, click "Stop" button
5. Analysis:
   - Check FPS chart for red bars (indicates dropped frames)
   - Hover over Frames section to see frame times
   - Identify any frames > 16.67ms (60fps budget)
   - Examine Main section flame chart for long tasks (red triangles)
```

**Key metrics to capture:**

- **FPS Chart:** Green = smooth, red bars = dropped frames
- **Frame Times:** Hover over Frames section, look for values < 16.67ms
- **Main Thread Activity:** Identify Layout, Rendering, Painting events
- **Long Tasks:** Red triangles indicate tasks > 50ms (warning sign)

**Source:** [Chrome DevTools - Analyze Runtime Performance](https://developer.chrome.com/docs/devtools/performance)

### Pattern 2: Performance Monitor for Real-Time Gameplay Metrics

**What:** Use the Performance Monitor panel to observe real-time metrics during continuous gameplay, tracking FPS, DOM nodes, CPU usage, and layout activity.

**When to use:** Stress testing with all object types visible simultaneously for 30+ seconds.

**Example:**

```markdown
# Performance Monitor Validation Procedure

1. Open DevTools Command Menu (Cmd+Shift+P / Ctrl+Shift+P)
2. Type "Performance monitor" and select
3. Monitor displays real-time metrics:
   - CPU usage (% of core)
   - JavaScript heap size (memory allocated)
   - DOM Nodes (total count in document)
   - Layouts / sec (reflow frequency)
   - Style recalcs / sec (CSS recomputation)
4. Play game for 30 seconds, observe:
   - FPS should stay near 60
   - DOM Nodes should stay constant (no leaks)
   - Layouts/sec should be low (<10/sec) except during updates
5. Screenshot panel showing stable metrics
```

**Target metrics for gSnake:**

- **FPS:** 58-60 (consistent, no prolonged drops)
- **DOM Nodes:** ~200-400 (grid cells + UI, stable count)
- **CPU Usage:** <50% during gameplay
- **Layouts/sec:** <5 during static, spikes during moves acceptable

**Source:** [Chrome DevTools - Performance Monitor](https://developer.chrome.com/docs/devtools/performance-monitor)

### Pattern 3: Visual Regression Testing with Screenshot Comparison

**What:** Capture reference screenshots of all CellType objects and compare with current implementation to verify SVG rendering matches expected appearance.

**When to use:** One-time validation that visual upgrade renders correctly, before/after comparison for quality assurance.

**Example (Manual Approach):**

```markdown
# Manual Visual Regression Testing

## Baseline Capture (Before SVG Upgrade)
1. Checkout commit before Phase 1 (colored divs)
2. Load level with all object types
3. Use browser screenshot tool to capture each object type
4. Save to tests/visual/baselines/

## Current Capture (After SVG Upgrade)
1. Checkout current commit (SVG rendering)
2. Load same level
3. Capture screenshots of each object type
4. Save to tests/visual/current/

## Comparison
1. Open baseline and current side-by-side
2. Verify:
   - All objects recognizable as intended type
   - Transparency levels correct (Spike 0.8, Stone 0.85, Obstacle 0.9)
   - No rendering artifacts or missing symbols
   - Colors match design intent
3. Document any visual differences in verification report
```

**Example (Automated with Playwright - Optional):**

```typescript
// tests/visual/cell-rendering.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Cell Rendering Visual Regression', () => {
  test('SnakeHead renders correctly', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.game-field');

    // Isolate SnakeHead cell
    const snakeHead = page.locator('.cell').filter({ hasText: 'SnakeHead' }).first();

    // Compare against baseline
    await expect(snakeHead).toHaveScreenshot('SnakeHead.png', {
      maxDiffPixels: 10, // Allow minor anti-aliasing differences
    });
  });

  // Repeat for each CellType: Food, Spike, Stone, Obstacle, Exit, etc.
});
```

**Configuration for consistency:**

```typescript
// playwright.config.ts
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 10, // Tolerance for anti-aliasing
    },
  },
  use: {
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1, // Consistent pixel density
  },
});
```

**Source:** [Playwright - Visual Comparisons](https://playwright.dev/docs/test-snapshots)

### Pattern 4: CSS `will-change` Validation for Animated Elements

**What:** Inspect DOM to verify `will-change` CSS hints are applied only to elements that are actively animating, not static objects.

**When to use:** Final validation step to ensure GPU acceleration is optimized correctly.

**Example:**

```markdown
# will-change Validation Procedure

1. Open Chrome DevTools > Elements tab
2. Select individual Cell elements during gameplay
3. Check Computed styles panel for `will-change` property
4. Expected behavior:
   - Static cells (food, obstacles): NO will-change
   - Snake head during movement: will-change MAY be present if animated
   - Empty cells: NO will-change
5. If will-change present on all cells, it's a performance issue
```

**Correct Implementation (from Phase 3):**

```svelte
<!-- Cell.svelte - Current implementation -->
<svg class="cell" viewBox="0 0 32 32" style="opacity: {opacity}">
  <use href="#{symbolId}" />
</svg>

<style>
  .cell {
    width: 100%;
    height: 100%;
    display: block;
    /* NO will-change: transform; (correct) */
  }
</style>
```

**Anti-Pattern (if found):**

```css
/* DO NOT DO THIS - wastes GPU memory */
.cell {
  will-change: transform, opacity; /* Applied to ALL cells */
}
```

**Source:** [MDN - CSS will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)

### Anti-Patterns to Avoid

- **Premature Playwright integration:** Adding full visual regression test suite for a one-time upgrade adds complexity. Manual screenshot comparison is sufficient unless ongoing regression testing is planned.

- **Lighthouse audits instead of Performance profiling:** Lighthouse measures page load performance, not interactive gameplay frame rates. Use Performance tab for 60fps validation.

- **will-change on all cells:** Applying `will-change: transform` to all grid cells increases GPU memory usage without benefit. Only apply to elements that will animate.

- **Testing in production build only:** Always test performance in both development and production modes. Development mode has overhead from HMR and source maps, but production issues may not appear in dev.

- **Single short recording:** Performance issues may only appear after extended play. Record multiple sessions of 30+ seconds with different gameplay patterns.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Screenshot comparison | Custom image diff algorithm | Playwright's toHaveScreenshot() with pixelmatch | Handles anti-aliasing, cross-platform rendering differences, provides configurable thresholds |
| Frame time measurement | console.time() in game loop | Chrome DevTools Performance tab | Accurate native profiling, flame charts, identifies bottlenecks automatically |
| Memory leak detection | Custom object counting | Chrome DevTools heap snapshots | Industry standard, detached DOM detection, visual comparison UI |
| FPS counting | requestAnimationFrame timestamps | Performance Monitor panel or FPS meter | Built-in, no instrumentation overhead, accurate |

**Key insight:** Browser DevTools provide production-grade profiling that outperforms custom solutions. Screenshot comparison requires pixel-level accuracy that only specialized libraries handle correctly across platforms.

## Common Pitfalls

### Pitfall 1: Inconsistent Screenshot Environments

**What goes wrong:** Visual regression tests fail due to minor pixel differences from different GPUs, browser versions, or OS font rendering, even when SVGs render correctly.

**Why it happens:** Browser rendering varies by environment. Anti-aliasing, sub-pixel rendering, and font hinting differ across platforms.

**How to avoid:**

1. **Consistent environment:** Capture baseline and current screenshots on the same machine, same browser version
2. **Set pixelmatch threshold:** Allow 5-10 pixel differences for anti-aliasing (Playwright's `maxDiffPixels` option)
3. **Disable animations:** Ensure no CSS transitions or animations during screenshot capture
4. **Fixed viewport:** Use consistent window size and device scale factor (1x, not 2x retina)

**Warning signs:**

- Screenshots differ by 1-2 pixels around edges (anti-aliasing)
- Font rendering slightly different (OS-specific)
- Playwright tests fail with "Too many pixel differences" but visual inspection shows no issue

**Source:** [Playwright - Visual Comparisons](https://playwright.dev/docs/test-snapshots), [BrowserStack - Snapshot Testing 2026](https://www.browserstack.com/guide/playwright-snapshot-testing)

### Pitfall 2: Profiling Development Mode Instead of Production

**What goes wrong:** Performance profiling shows poor frame times or high CPU usage that won't appear in production builds.

**Why it happens:** Development mode includes HMR (Hot Module Replacement), source maps, and unminified code. Production builds are optimized and tree-shaken.

**How to avoid:**

1. Profile in **both** development and production modes
2. For production profiling: `npm run build && npm run preview`
3. Expect ~20-30% better performance in production (faster parsing, smaller bundles)
4. If dev mode is slow but production is fast, that's acceptable
5. If both are slow, investigate rendering bottlenecks

**Warning signs:**

- Frame times >16.67ms in dev mode but pass in production
- High JavaScript execution time in dev that disappears in production
- Memory usage significantly lower in production

**Source:** [DebugBear - DevTools Performance](https://www.debugbear.com/blog/devtools-performance)

### Pitfall 3: Short Performance Recording Sessions

**What goes wrong:** Initial gameplay appears smooth, but performance degrades after 1-2 minutes of play due to memory leaks or accumulated DOM nodes.

**Why it happens:** Some issues only manifest after repeated actions (level switches, object spawning, cell updates).

**How to avoid:**

1. Record **at least 30 seconds** of active gameplay
2. Test multiple scenarios:
   - Rapid snake movement (many frame updates)
   - Level with falling objects (gravity-driven updates)
   - Level switching 3-5 times (cleanup validation)
3. Monitor Performance Monitor for trends (DOM nodes increasing, memory climbing)
4. Take heap snapshots before/after extended play

**Warning signs:**

- FPS starts at 60, gradually drops to 45-50 over time
- DOM node count increases steadily during play
- Memory usage climbs without leveling off
- Browser becomes sluggish after 2+ minutes

**Source:** [Chrome DevTools - Fix Memory Problems](https://developer.chrome.com/docs/devtools/memory-problems)

### Pitfall 4: Ignoring Red Triangles in Performance Flame Chart

**What goes wrong:** Frame times appear acceptable in FPS chart, but gameplay feels janky due to long tasks blocking the main thread.

**Why it happens:** 60fps doesn't guarantee smooth experience if individual tasks take >50ms. Browser can't respond to input during long tasks.

**How to avoid:**

1. Look for **red triangles** in the Performance tab Main section (indicates long task >50ms)
2. Click on long task events to see what caused the delay
3. Common culprits:
   - Layout thrashing (multiple layout recalculations)
   - Forced synchronous layouts
   - Heavy JavaScript execution
   - SVG parsing or rendering
4. Break up long tasks or optimize expensive operations

**Warning signs:**

- FPS chart mostly green, but gameplay feels laggy during certain actions
- User input delayed or dropped (keypresses ignored)
- Red triangles appear during frame updates
- "Recalculate Style" or "Layout" events >10ms

**Source:** [Chrome DevTools - Performance Features Reference](https://developer.chrome.com/docs/devtools/performance/reference)

### Pitfall 5: Testing Only One Level Configuration

**What goes wrong:** Performance passes on simple levels but fails on complex levels with many simultaneous object types.

**Why it happens:** Rendering performance scales with DOM complexity. More visible objects = more SVG elements to render.

**How to avoid:**

1. Test **stress test level** with all object types simultaneously:
   - Multiple falling objects
   - Snake body of 10+ segments
   - Obstacles, spikes, stones scattered across grid
   - Floating food items
2. Success criteria explicitly requires "all object types simultaneously visible"
3. Create dedicated test level if needed (max 20x20 grid with 50+ objects)
4. Validate 60fps maintained for 30 seconds under maximum load

**Warning signs:**

- Simple levels run at 60fps, complex levels drop to 45fps
- Frame times increase proportionally with object count
- Performance degrades with longer snake body
- Browser struggles when 5+ falling objects active

**Source:** [JSSchools - Web Animation Performance Monitoring](https://jsschools.com/web_dev/mastering-web-animation-performance-monitoring-fo/)

## Code Examples

Verified patterns from official sources and current implementation:

### Performance Profiling Validation Script (Manual Procedure)

```markdown
# 04-performance-profiling-procedure.md

## Prerequisites
- Chrome browser (v120+)
- Dev server running: `cd gsnake-web && npm run dev`
- Navigate to http://localhost:3000

## Step 1: Frame Time Profiling

**Objective:** Validate frame times < 16.67ms during rapid updates

1. Open DevTools (F12) > Performance tab
2. Click Record button (⚫)
3. Gameplay actions (15-20 seconds):
   - Press arrow keys rapidly (snake movement)
   - Let falling objects drop
   - Collect food items
4. Click Stop button (⬛)
5. Analysis:
   - FPS Chart: Look for red bars (dropped frames)
   - Frames Section: Hover over green bars, verify times < 16.67ms
   - Main Section: Check for red triangles (long tasks)
6. Screenshot results for verification report

**Pass Criteria:**
- 95%+ of frames < 16.67ms (60fps)
- No red bars lasting >500ms
- No long tasks >50ms during normal gameplay

## Step 2: Real-Time FPS Monitoring

**Objective:** Validate 60fps during 30-second stress test

1. Open Command Menu (Cmd+Shift+P / Ctrl+Shift+P)
2. Type "Performance monitor" → Select
3. Load level with all object types visible
4. Play continuously for 30 seconds
5. Observe Performance Monitor metrics:
   - FPS: Should stay 58-60
   - DOM Nodes: Should remain stable (~300-500)
   - CPU Usage: Should stay <50%
6. Screenshot final metrics

**Pass Criteria:**
- Average FPS ≥ 58 over 30 seconds
- No FPS drops below 45 for >2 seconds
- DOM node count stable (±5% variance)

## Step 3: Memory Leak Check

**Objective:** Validate no memory increase during level switching

1. DevTools > Memory tab
2. Take "Heap snapshot" (Snapshot 1)
3. Play level 1 for ~10 seconds
4. Switch to level 2
5. Play level 2 for ~10 seconds
6. Switch to level 3
7. Take "Heap snapshot" (Snapshot 2)
8. Compare: Select Snapshot 2, change view to "Comparison"
9. Check memory delta

**Pass Criteria:**
- Memory increase <1MB between snapshots
- No "Detached" DOM nodes accumulating
- JavaScript heap size stable

## Step 4: will-change Validation

**Objective:** Verify GPU hints only on animated elements

1. DevTools > Elements tab
2. Select `.cell` element during gameplay
3. Check Computed styles panel
4. Verify `will-change` property absent (or only on animating cells)

**Pass Criteria:**
- Static cells have NO will-change property
- will-change only on actively animating elements (if any)
```

**Source:** [Chrome DevTools - Performance](https://developer.chrome.com/docs/devtools/performance)

### Visual Regression Baseline Capture (Manual)

```markdown
# 04-visual-regression-procedure.md

## Objective
Capture reference screenshots of all CellType objects to verify SVG rendering quality

## Setup
1. Dev server running: `cd gsnake-web && npm run dev`
2. Browser zoom at 100% (Cmd+0 / Ctrl+0)
3. Window size: 1280x720 or larger
4. DevTools closed (to avoid viewport changes)

## Capture Procedure

For each CellType (SnakeHead, SnakeBody, Food, FloatingFood, FallingFood, Obstacle, Stone, Spike, Exit, Empty):

1. Load level containing that object type
2. Use browser screenshot tool:
   - Chrome: Right-click element > "Capture node screenshot"
   - Or use Cmd+Shift+4 (Mac) / Snipping Tool (Windows)
3. Zoom to 200% if needed for clarity
4. Save to `tests/visual/baselines/{CellType}.png`
5. Verify screenshot shows:
   - Recognizable object shape
   - Correct opacity (Spike=0.8, Stone=0.85, Obstacle=0.9, others=1.0)
   - No rendering artifacts
   - Clean edges (anti-aliasing applied)

## Validation Checklist

For each screenshot:
- [ ] Object visually matches intended design
- [ ] Transparency levels correct (if applicable)
- [ ] No missing parts or glitches
- [ ] Symbol fills entire cell viewBox (no clipping)
- [ ] Colors consistent with sprite definitions

## Comparison with Previous Implementation

If validating upgrade from colored divs:
1. Checkout commit before Phase 1
2. Capture "before" screenshots
3. Checkout current implementation
4. Capture "after" screenshots
5. Document visual improvements in verification report
```

### Production Build Performance Validation

```bash
#!/bin/bash
# scripts/validate-production-performance.sh

echo "Building production bundle..."
cd gsnake-web
npm run build

echo "Starting preview server..."
npm run preview &
PREVIEW_PID=$!

echo "Waiting for server to start..."
sleep 3

echo ""
echo "==================================="
echo "PRODUCTION PERFORMANCE VALIDATION"
echo "==================================="
echo ""
echo "Server running at http://localhost:4173"
echo ""
echo "Manual steps:"
echo "1. Open Chrome browser to http://localhost:4173"
echo "2. Open DevTools (F12) > Performance tab"
echo "3. Record 30 seconds of gameplay"
echo "4. Verify frame times < 16.67ms"
echo "5. Press Ctrl+C to stop preview server"
echo ""
echo "Expected: Production build 20-30% faster than dev mode"
echo ""

# Wait for user to finish testing
read -p "Press Enter when testing complete..."

echo "Stopping preview server (PID: $PREVIEW_PID)..."
kill $PREVIEW_PID
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Lighthouse performance audits | Performance tab for gameplay profiling | 2023+ | Lighthouse measures page load, not interactive frame rates; DevTools Performance tab captures runtime behavior |
| Manual frame counting with RAF | Chrome DevTools FPS meter overlay | Built-in since Chrome 90 | Accurate native profiling without instrumentation overhead |
| BackstopJS for visual regression | Playwright toHaveScreenshot() | Playwright 1.20+ (2022) | Simplified setup, built-in pixelmatch comparison, first-class TypeScript support |
| XHR-based sprite loading | Vite native ?url imports with fetch | Vite 2+ (2021) | Simpler syntax, better tree-shaking, no plugin needed |
| xlink:href for SVG use | Plain href attribute | SVG 2 spec (2018) | Modern standard, backward compatible |

**Deprecated/outdated:**

- **BackstopJS:** Still viable but Playwright's built-in screenshot comparison is simpler for new projects
- **Puppeteer for visual testing:** Chrome-only, whereas Playwright supports multiple browsers (though gSnake targets Chrome primarily)
- **console.time() for frame profiling:** DevTools Performance tab provides more accurate data with flame charts

## Open Questions

1. **Should we implement automated visual regression tests with Playwright?**
   - What we know: Playwright provides robust screenshot comparison via `toHaveScreenshot()`, project already has Vitest for unit testing
   - What's unclear: Whether ongoing visual regression testing is needed after this one-time upgrade milestone
   - Recommendation: Start with manual screenshot comparison (sufficient for validation). Add Playwright only if visual regressions become a recurring problem in future development. **DECISION: Manual approach for Phase 4, document setup for future if needed.**

2. **What defines "all object types simultaneously visible" for stress testing?**
   - What we know: 10 total CellType values (including Empty), typical grid is 20x20 = 400 cells
   - What's unclear: Exact object count that constitutes "stress test" (5 of each type? Max grid density?)
   - Recommendation: Create test level with: 1 SnakeHead, 10+ SnakeBody segments, 3-5 falling objects, 10+ obstacles/spikes/stones, 5+ food items = ~40 non-Empty objects. This represents realistic maximum complexity. **ASSUMPTION: 30-50 simultaneous non-Empty objects is sufficient stress test.**

3. **Should we test in production mode only, or both dev and production?**
   - What we know: Development mode has HMR overhead, production is optimized and minified
   - What's unclear: Whether success criteria require 60fps in dev mode or just production
   - Recommendation: Profile both, but **success criteria apply to production build**. Dev mode performance is informational but not blocking. Document if dev mode is significantly slower to avoid user confusion.

4. **Are there existing test levels that contain all object types, or should we create one?**
   - What we know: Project has gsnake-levels submodule with level definitions
   - What's unclear: Whether existing levels provide adequate coverage for stress testing
   - Recommendation: Examine existing levels first. If none contain 5+ simultaneous falling objects + full object variety, create a dedicated `test-level-performance.json` for validation purposes only (not for normal gameplay).

## Sources

### Primary (HIGH confidence)

- [Chrome DevTools - Analyze Runtime Performance](https://developer.chrome.com/docs/devtools/performance) - Official Google documentation for Performance tab usage
- [Chrome DevTools - Performance Monitor](https://developer.chrome.com/docs/devtools/performance-monitor) - Official guide for real-time metrics panel
- [Chrome DevTools - Record Heap Snapshots](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots) - Memory leak detection workflow
- [MDN - CSS will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change) - Authoritative will-change property reference
- [Playwright - Visual Comparisons](https://playwright.dev/docs/test-snapshots) - Official Playwright screenshot testing documentation
- Current codebase: Cell.svelte, SpriteLoader.svelte, GameGrid.svelte, vitest.config.ts

### Secondary (MEDIUM confidence)

- [DebugBear - DevTools Performance Tab](https://www.debugbear.com/blog/devtools-performance) - Practical guide to Performance tab (2025)
- [Wingify Engineering - Getting 60 FPS](https://engineering.wingify.com/posts/getting-60fps-using-devtools/) - Real-world frame profiling case study
- [BrowserStack - Playwright Snapshot Testing](https://www.browserstack.com/guide/playwright-snapshot-testing) - Visual regression testing guide (2026)
- [Chrome Developers - Hardware-Accelerated Animations](https://developer.chrome.com/blog/hardware-accelerated-animations) - GPU acceleration best practices
- [MDN - Animation Performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate) - 60fps animation standards

### Tertiary (LOW confidence)

- [JSSchools - Web Animation Performance Monitoring](https://jsschools.com/web_dev/mastering-web-animation-performance-monitoring-fo/) - General performance monitoring guidance
- [TestingPlus - Playwright Visual Regression](https://testingplus.me/visual-regression-playwright-testing-part-one/) - Tutorial on visual testing setup
- WebSearch results on SVG rendering performance - requires project-specific validation

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - Chrome DevTools and Performance Monitor are built-in, industry-standard tools with official documentation
- Architecture: HIGH - Validation patterns based on official Chrome DevTools docs and proven performance profiling techniques
- Pitfalls: HIGH - Common issues well-documented in official sources and community resources

**Research date:** 2026-02-10
**Valid until:** 90 days (2026-05-11) - Chrome DevTools and Performance profiling practices are stable, minimal churn expected
