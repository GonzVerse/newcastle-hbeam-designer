import { test, expect } from '@playwright/test';

test.describe('Interactive Diagram Feature (Tasks #1 & #2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Task #1: Dynamic Diagram Updates', () => {
    test('should show default descriptive labels when form is empty', async ({ page }) => {
      // Clear all fields to ensure we see default labels
      await page.locator('input#p_psf').clear();
      await page.locator('input#a_ft').clear();
      await page.locator('input#b_ft').clear();
      await page.locator('input#L_ft').clear();
      await page.locator('input#W_ft').clear();
      await page.locator('input#S_ft').clear();

      // Check that diagram shows descriptive default labels
      const diagramGuide = page.locator('div.bg-blue-50');
      await expect(diagramGuide).toContainText(': Floor Load (PSF)');
      await expect(diagramGuide).toContainText(': Bumpout Depth (ft)');
      await expect(diagramGuide).toContainText(': Overhang Past Post (ft)');
      await expect(diagramGuide).toContainText(': Wall to Posts (ft)');
      await expect(diagramGuide).toContainText(': Bumpout Width (ft)');
      await expect(diagramGuide).toContainText(': Post Spacing (ft)');
    });

    test('should update diagram instantly when user types p value', async ({ page }) => {
      // Clear p field first
      await page.locator('input#p_psf').clear();

      // Type "50" and verify diagram updates
      await page.locator('input#p_psf').type('50');

      const diagramGuide = page.locator('div.bg-blue-50');
      await expect(diagramGuide).toContainText(': 50 PSF');
      await expect(diagramGuide).not.toContainText(': Floor Load (PSF)');
    });

    test('should update diagram instantly when user types L value', async ({ page }) => {
      await page.locator('input#L_ft').clear();
      await page.locator('input#L_ft').type('13');

      const diagramGuide = page.locator('div.bg-blue-50');
      await expect(diagramGuide).toContainText(': 13 ft');
    });

    test('should update diagram for all 6 dimension fields', async ({ page }) => {
      // Clear all fields
      await page.locator('input#p_psf').clear();
      await page.locator('input#a_ft').clear();
      await page.locator('input#b_ft').clear();
      await page.locator('input#L_ft').clear();
      await page.locator('input#W_ft').clear();
      await page.locator('input#S_ft').clear();

      // Type values in all fields
      await page.locator('input#p_psf').type('50');
      await page.locator('input#a_ft').type('3');
      await page.locator('input#b_ft').type('2');
      await page.locator('input#L_ft').type('13');
      await page.locator('input#W_ft').type('10');
      await page.locator('input#S_ft').type('9.25');

      // Verify all values appear in diagram
      const diagramGuide = page.locator('div.bg-blue-50');
      await expect(diagramGuide).toContainText(': 50 PSF');
      await expect(diagramGuide).toContainText(': 3 ft');
      await expect(diagramGuide).toContainText(': 2 ft');
      await expect(diagramGuide).toContainText(': 13 ft');
      await expect(diagramGuide).toContainText(': 10 ft');
      await expect(diagramGuide).toContainText(': 9.25 ft');
    });

    test('should revert to default label when field is cleared', async ({ page }) => {
      // Type a value
      await page.locator('input#p_psf').fill('50');

      const diagramGuide = page.locator('div.bg-blue-50');
      await expect(diagramGuide).toContainText(': 50 PSF');

      // Clear the field
      await page.locator('input#p_psf').clear();

      // Should revert to default label
      await expect(diagramGuide).toContainText(': Floor Load (PSF)');
      await expect(diagramGuide).not.toContainText(': 50 PSF');
    });

    test('should handle decimal values in diagram', async ({ page }) => {
      await page.locator('input#S_ft').clear();
      await page.locator('input#S_ft').type('9.25');

      const diagramGuide = page.locator('div.bg-blue-50');
      await expect(diagramGuide).toContainText(': 9.25 ft');
    });

    test('should update diagram on every keystroke (real-time)', async ({ page }) => {
      await page.locator('input#p_psf').clear();

      const diagramGuide = page.locator('div.bg-blue-50');

      // Type "5" - should show immediately
      await page.locator('input#p_psf').type('5');
      await expect(diagramGuide).toContainText(': 5 PSF');

      // Type "0" to make it "50" - should update immediately
      await page.locator('input#p_psf').type('0');
      await expect(diagramGuide).toContainText(': 50 PSF');
    });

    test('should handle rapid typing without lag', async ({ page }) => {
      await page.locator('input#L_ft').clear();

      // Type quickly
      await page.locator('input#L_ft').type('123', { delay: 50 });

      const diagramGuide = page.locator('div.bg-blue-50');
      await expect(diagramGuide).toContainText(': 123 ft');
    });

    test('should handle extreme values without breaking', async ({ page }) => {
      await page.locator('input#p_psf').clear();
      await page.locator('input#p_psf').type('9999');

      const diagramGuide = page.locator('div.bg-blue-50');
      await expect(diagramGuide).toContainText(': 9999 PSF');
    });

    test('should handle negative values in diagram (even though validation will catch them)', async ({ page }) => {
      await page.locator('input#p_psf').clear();
      await page.locator('input#p_psf').type('-50');

      const diagramGuide = page.locator('div.bg-blue-50');
      // Diagram should still show the value (validation is separate from display)
      await expect(diagramGuide).toContainText('-50 PSF');
    });
  });

  test.describe('Task #2: Text Contrast and Readability', () => {
    test('should have black text for all diagram labels', async ({ page }) => {
      const diagramGuide = page.locator('div.bg-blue-50');

      // Check title
      const title = diagramGuide.locator('h3');
      await expect(title).toHaveClass(/text-black/);

      // Check description
      const description = diagramGuide.locator('p').first();
      await expect(description).toHaveClass(/text-black/);

      // Check tip text
      const tip = diagramGuide.locator('p.italic');
      await expect(tip).toHaveClass(/text-black/);
    });

    test('should have text-black class on all legend text spans', async ({ page }) => {
      // Check that all legend text (after the blue labels) uses text-black
      const legendText = page.locator('div.bg-white.rounded-lg span.text-black');
      const count = await legendText.count();

      // Should have 6 text-black spans (one for each dimension)
      expect(count).toBe(6);
    });

    test('should have blue-700 labels that are still readable', async ({ page }) => {
      // The dimension letters (p, a, b, L, W, S) should be blue-700
      const blueLabels = page.locator('div.bg-white.rounded-lg strong.text-blue-700');
      const count = await blueLabels.count();

      // Should have 6 blue labels
      expect(count).toBe(6);
    });

    test('should remain readable when zoomed to 200%', async ({ page }) => {
      // Zoom to 200%
      await page.evaluate(() => {
        document.body.style.zoom = '2';
      });

      const diagramGuide = page.locator('div.bg-blue-50');
      await expect(diagramGuide).toBeVisible();

      // Text should not overlap or be cut off
      await expect(diagramGuide.locator('h3')).toBeVisible();
      await expect(diagramGuide.locator('p').first()).toBeVisible();
    });

    test('should be readable on mobile viewport', async ({ page, viewport }) => {
      // Use mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      const diagramGuide = page.locator('div.bg-blue-50');
      await expect(diagramGuide).toBeVisible();

      // Check that text is large enough (title should be at least xl)
      const title = diagramGuide.locator('h3');
      await expect(title).toHaveClass(/text-xl/);

      // Check that legend is visible and readable
      const legend = diagramGuide.locator('div.bg-white.rounded-lg').first();
      await expect(legend).toBeVisible();
    });

    test('should have no text with gray color classes on blue-50 background', async ({ page }) => {
      const diagramGuide = page.locator('div.bg-blue-50');

      // These gray classes should NOT exist in the diagram
      const grayText = diagramGuide.locator('.text-gray-500, .text-gray-600, .text-gray-400');
      const count = await grayText.count();

      expect(count).toBe(0);
    });

    test('should have visible contrast between text and background', async ({ page }) => {
      // Take a screenshot of the diagram to verify visually
      const diagramGuide = page.locator('div.bg-blue-50');
      await expect(diagramGuide).toHaveScreenshot('diagram-contrast.png', {
        maxDiffPixels: 100,
      });
    });
  });

  test.describe('Integration: Diagram + Text Contrast Together', () => {
    test('should show live values in black text on blue-50 background', async ({ page }) => {
      await page.locator('input#p_psf').clear();
      await page.locator('input#p_psf').type('50');

      const diagramGuide = page.locator('div.bg-blue-50');

      // Should show live value
      await expect(diagramGuide).toContainText(': 50 PSF');

      // And it should be black text
      const valueSpan = diagramGuide.locator('span.text-black:has-text(": 50 PSF")');
      await expect(valueSpan).toBeVisible();
    });

    test('should maintain readability during rapid input changes', async ({ page }) => {
      await page.locator('input#L_ft').clear();

      // Type rapidly and verify diagram stays readable
      for (let i = 1; i <= 20; i++) {
        await page.locator('input#L_ft').fill(i.toString());
        await page.waitForTimeout(50); // 50ms between updates
      }

      const diagramGuide = page.locator('div.bg-blue-50');
      await expect(diagramGuide).toContainText(': 20 ft');
      await expect(diagramGuide).toBeVisible();
    });

    test('should show all 6 live values simultaneously with good contrast', async ({ page }) => {
      await page.locator('input#p_psf').fill('50');
      await page.locator('input#a_ft').fill('3');
      await page.locator('input#b_ft').fill('2');
      await page.locator('input#L_ft').fill('13');
      await page.locator('input#W_ft').fill('10');
      await page.locator('input#S_ft').fill('9.25');

      const diagramGuide = page.locator('div.bg-blue-50');

      // All values should be visible with text-black class
      await expect(diagramGuide.locator('span.text-black:has-text(": 50 PSF")')).toBeVisible();
      await expect(diagramGuide.locator('span.text-black:has-text(": 3 ft")').first()).toBeVisible();
      await expect(diagramGuide.locator('span.text-black:has-text(": 2 ft")')).toBeVisible();
      await expect(diagramGuide.locator('span.text-black:has-text(": 13 ft")')).toBeVisible();
      await expect(diagramGuide.locator('span.text-black:has-text(": 10 ft")')).toBeVisible();
      await expect(diagramGuide.locator('span.text-black:has-text(": 9.25 ft")')).toBeVisible();
    });
  });

  test.describe('Mobile-specific tests for field workers', () => {
    test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

    test('should have large, readable text on mobile', async ({ page }) => {
      const diagramGuide = page.locator('div.bg-blue-50');

      // Title should be extra large on mobile
      const title = diagramGuide.locator('h3');
      const fontSize = await title.evaluate(el =>
        window.getComputedStyle(el).fontSize
      );

      // Should be at least 18px (1.125rem = text-xl)
      expect(parseFloat(fontSize)).toBeGreaterThanOrEqual(18);
    });

    test('should stack legend in single column on narrow screens', async ({ page }) => {
      const legend = page.locator('div.bg-white.rounded-lg.grid').first();

      // On mobile, grid should stack (grid-cols-1)
      await expect(legend).toHaveClass(/grid-cols-1/);
    });

    test('should show live diagram updates on mobile', async ({ page }) => {
      // Test that interactivity works on mobile viewport
      await page.locator('input#p_psf').clear();
      await page.locator('input#p_psf').type('50');

      const diagramGuide = page.locator('div.bg-blue-50');
      await expect(diagramGuide).toContainText(': 50 PSF');
    });

    test('should have no horizontal scroll with diagram visible', async ({ page }) => {
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);

      // Should not have horizontal scrollbar
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // Allow 5px tolerance
    });
  });

  test.describe('Edge cases and error conditions', () => {
    test('should handle whitespace-only input', async ({ page }) => {
      await page.locator('input#p_psf').fill('   ');

      const diagramGuide = page.locator('div.bg-blue-50');
      // Should revert to default label (whitespace is treated as empty)
      await expect(diagramGuide).toContainText(': Floor Load (PSF)');
    });

    test('should handle very long numbers', async ({ page }) => {
      await page.locator('input#L_ft').fill('123456789.123456');

      const diagramGuide = page.locator('div.bg-blue-50');
      await expect(diagramGuide).toContainText(': 123456789.123456 ft');
    });

    test('should not break when special characters are entered', async ({ page }) => {
      await page.locator('input#p_psf').fill('abc@#$');

      // Diagram should still render without crashing
      const diagramGuide = page.locator('div.bg-blue-50');
      await expect(diagramGuide).toBeVisible();
    });

    test('should handle all fields cleared simultaneously', async ({ page }) => {
      // Fill all fields
      await page.locator('input#p_psf').fill('50');
      await page.locator('input#a_ft').fill('3');
      await page.locator('input#b_ft').fill('2');
      await page.locator('input#L_ft').fill('13');
      await page.locator('input#W_ft').fill('10');
      await page.locator('input#S_ft').fill('9.25');

      // Clear all fields
      await page.locator('input#p_psf').clear();
      await page.locator('input#a_ft').clear();
      await page.locator('input#b_ft').clear();
      await page.locator('input#L_ft').clear();
      await page.locator('input#W_ft').clear();
      await page.locator('input#S_ft').clear();

      // All labels should revert to defaults
      const diagramGuide = page.locator('div.bg-blue-50');
      await expect(diagramGuide).toContainText(': Floor Load (PSF)');
      await expect(diagramGuide).toContainText(': Bumpout Depth (ft)');
      await expect(diagramGuide).toContainText(': Overhang Past Post (ft)');
      await expect(diagramGuide).toContainText(': Wall to Posts (ft)');
      await expect(diagramGuide).toContainText(': Bumpout Width (ft)');
      await expect(diagramGuide).toContainText(': Post Spacing (ft)');
    });
  });
});
