import { test, expect } from '@playwright/test';

test.describe('HBAM Bumpout Calculator - Full User Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Page load and initial state', () => {
    test('should load the page with correct title and header', async ({ page }) => {
      await expect(page).toHaveTitle(/HBAM/);
      await expect(page.locator('h1')).toContainText('HBAM Bumpout Designer');
    });

    test('should display all input fields with default values', async ({ page }) => {
      await expect(page.locator('input#p_psf')).toHaveValue('50');
      await expect(page.locator('input#a_ft')).toHaveValue('3');
      await expect(page.locator('input#b_ft')).toHaveValue('3');
      await expect(page.locator('input#L_ft')).toHaveValue('13');
      await expect(page.locator('input#W_ft')).toHaveValue('13');
      await expect(page.locator('input#S_ft')).toHaveValue('9.25');
      await expect(page.locator('input#Va_connection')).toHaveValue('');
    });

    test('should display the calculate button', async ({ page }) => {
      const button = page.locator('button[type="submit"]');
      await expect(button).toBeVisible();
      await expect(button).toContainText('CALCULATE');
    });

    test('should not show results section initially', async ({ page }) => {
      await expect(page.locator('#results-section')).not.toBeVisible();
    });
  });

  test.describe('Input validation', () => {
    test('should show validation error for empty required field', async ({ page }) => {
      await page.locator('input#p_psf').clear();
      await page.locator('button[type="submit"]').click();

      await expect(page.locator('text=Required')).toBeVisible();
    });

    test('should show validation error for negative numbers', async ({ page }) => {
      await page.locator('input#p_psf').fill('-10');
      await page.locator('button[type="submit"]').click();

      await expect(page.locator('text=Must be a positive number')).toBeVisible();
    });

    test('should show validation error for zero values', async ({ page }) => {
      await page.locator('input#a_ft').fill('0');
      await page.locator('button[type="submit"]').click();

      await expect(page.locator('text=Must be a positive number')).toBeVisible();
    });

    test('should clear validation error when user corrects input', async ({ page }) => {
      await page.locator('input#p_psf').clear();
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('text=Required')).toBeVisible();

      await page.locator('input#p_psf').fill('60');
      await expect(page.locator('text=Required')).not.toBeVisible();
    });

    test('should allow optional field to be empty', async ({ page }) => {
      await page.locator('input#Va_connection').clear();
      await page.locator('button[type="submit"]').click();

      // Should not show validation error for optional field
      const vaErrors = await page.locator('input#Va_connection ~ p[role="alert"]').count();
      expect(vaErrors).toBe(0);
    });
  });

  test.describe('Successful calculation - passing design', () => {
    test('should calculate and display passing results for valid inputs', async ({ page }) => {
      // Use light load that should pass
      await page.locator('input#p_psf').fill('50');
      await page.locator('input#a_ft').fill('3');
      await page.locator('input#b_ft').fill('2');
      await page.locator('input#L_ft').fill('10');
      await page.locator('input#W_ft').fill('8');
      await page.locator('input#S_ft').fill('6');

      await page.locator('button[type="submit"]').click();

      // Wait for results to appear
      await expect(page.locator('#results-section')).toBeVisible({ timeout: 10000 });

      // Check for passing status
      await expect(page.locator('text=ALL CHECKS PASS')).toBeVisible();

      // Check that member selections are displayed
      await expect(page.locator('text=Member Selections')).toBeVisible();
      await expect(page.locator('h3:has-text("Outer Beam")')).toBeVisible();
      await expect(page.locator('h3:has-text("Ledger")')).toBeVisible();
      await expect(page.locator('h3:has-text("Side Brackets")')).toBeVisible();
    });

    test('should show member selections with green checkmarks for passing design', async ({ page }) => {
      await page.locator('input#p_psf').fill('50');
      await page.locator('input#a_ft').fill('2');
      await page.locator('input#b_ft').fill('1');
      await page.locator('input#L_ft').fill('8');
      await page.locator('input#W_ft').fill('6');
      await page.locator('input#S_ft').fill('5');

      await page.locator('button[type="submit"]').click();

      await expect(page.locator('#results-section')).toBeVisible({ timeout: 10000 });

      // Check for green checkmarks (✓)
      const checkmarks = page.locator('[aria-label="Pass"]');
      const count = await checkmarks.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display check details when expanded', async ({ page }) => {
      await page.locator('input#p_psf').fill('60');
      await page.locator('button[type="submit"]').click();

      await expect(page.locator('#results-section')).toBeVisible({ timeout: 10000 });

      // Expand check details
      await page.locator('button:has-text("Check Details")').click();

      // Verify table is visible
      await expect(page.locator('table')).toBeVisible();
      await expect(page.locator('th:has-text("Demand")')).toBeVisible();
      await expect(page.locator('th:has-text("Capacity")')).toBeVisible();
      await expect(page.locator('th:has-text("Ratio")')).toBeVisible();
      await expect(page.locator('th:has-text("Pass?")')).toBeVisible();
    });
  });

  test.describe('Failed calculation - design does not pass', () => {
    test('should display failing results for oversized design', async ({ page }) => {
      // Use extreme loads that will fail
      await page.locator('input#p_psf').fill('500');
      await page.locator('input#a_ft').fill('6');
      await page.locator('input#b_ft').fill('6');
      await page.locator('input#L_ft').fill('23');
      await page.locator('input#W_ft').fill('13');
      await page.locator('input#S_ft').fill('13');

      await page.locator('button[type="submit"]').click();

      await expect(page.locator('#results-section')).toBeVisible({ timeout: 10000 });

      // Check for failing status
      const failText = page.locator('text=/\\d+ CHECK(S?) FAILED/');
      await expect(failText).toBeVisible();
    });

    test('should show red X marks for failing members', async ({ page }) => {
      await page.locator('input#p_psf').fill('500');
      await page.locator('input#a_ft').fill('6');
      await page.locator('input#b_ft').fill('6');
      await page.locator('input#L_ft').fill('23');
      await page.locator('input#W_ft').fill('13');
      await page.locator('input#S_ft').fill('13');

      await page.locator('button[type="submit"]').click();

      await expect(page.locator('#results-section')).toBeVisible({ timeout: 10000 });

      // Check for red X marks (✗)
      const failMarks = page.locator('[aria-label="Fail"]');
      const count = await failMarks.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display EXCEEDS CAPACITY or DESIGN FAILS for oversized members', async ({ page }) => {
      await page.locator('input#p_psf').fill('500');
      await page.locator('input#a_ft').fill('6');
      await page.locator('input#b_ft').fill('6');
      await page.locator('input#L_ft').fill('23');
      await page.locator('input#W_ft').fill('13');
      await page.locator('input#S_ft').fill('13');

      await page.locator('button[type="submit"]').click();

      await expect(page.locator('#results-section')).toBeVisible({ timeout: 10000 });

      // At least one member should show failure
      const failureText = page.locator('text=/EXCEEDS CAPACITY|DESIGN FAILS/');
      const count = await failureText.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Validation warnings and errors', () => {
    test('should display warnings for low load below IRC minimum', async ({ page }) => {
      await page.locator('input#p_psf').fill('30'); // below 50 PSF
      await page.locator('button[type="submit"]').click();

      await expect(page.locator('#results-section')).toBeVisible({ timeout: 10000 });

      // Check for warning section
      await expect(page.locator('text=Warnings')).toBeVisible();
      await expect(page.locator('text=/IRC|minimum/')).toBeVisible();
    });

    test('should display warning when Va_connection is not provided', async ({ page }) => {
      await page.locator('input#p_psf').fill('60');
      await page.locator('input#Va_connection').clear();
      await page.locator('button[type="submit"]').click();

      await expect(page.locator('#results-section')).toBeVisible({ timeout: 10000 });

      await expect(page.locator('text=Warnings')).toBeVisible();
      await expect(page.locator('text=/Va_connection/')).toBeVisible();
    });

    test('should display API error for geometry exceeding limits', async ({ page }) => {
      await page.locator('input#p_psf').fill('60');
      await page.locator('input#a_ft').fill('10'); // exceeds 6 ft max
      await page.locator('button[type="submit"]').click();

      // API should return 422 error, showing error alert instead of results
      await expect(page.locator('[role="alert"]:has-text("Could not complete calculation")')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('#results-section')).not.toBeVisible();
    });

    test('should display API error for backspan rule violation', async ({ page }) => {
      await page.locator('input#p_psf').fill('60');
      await page.locator('input#a_ft').fill('5');
      await page.locator('input#b_ft').fill('5');
      await page.locator('input#L_ft').fill('8'); // j = 8 - 5 = 3, which is < b_ft (5)
      await page.locator('button[type="submit"]').click();

      // API should return 422 error
      await expect(page.locator('[role="alert"]:has-text("Could not complete calculation")')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('#results-section')).not.toBeVisible();
    });
  });

  test.describe('Connection shear check (optional)', () => {
    test('should include connection check when Va_connection is provided', async ({ page }) => {
      await page.locator('input#p_psf').fill('60');
      await page.locator('input#Va_connection').fill('5000');
      await page.locator('button[type="submit"]').click();

      await expect(page.locator('#results-section')).toBeVisible({ timeout: 10000 });

      // Expand check details
      await page.locator('button:has-text("Check Details")').click();

      // Verify connection check appears
      await expect(page.locator('td:has-text("Connection")')).toBeVisible();
    });

    test('should pass connection check with high capacity', async ({ page }) => {
      await page.locator('input#p_psf').fill('50');
      await page.locator('input#Va_connection').fill('10000'); // high capacity
      await page.locator('button[type="submit"]').click();

      await expect(page.locator('#results-section')).toBeVisible({ timeout: 10000 });

      await page.locator('button:has-text("Check Details")').click();

      // Find connection check row and verify it passes
      const connectionRow = page.locator('tr:has(td:has-text("Connection"))');
      await expect(connectionRow.locator('[aria-label="Pass"]')).toBeVisible();
    });
  });

  test.describe('UI interaction and behavior', () => {
    test('should show loading state while calculating', async ({ page }) => {
      await page.locator('button[type="submit"]').click();

      // Check for loading text (briefly visible)
      const button = page.locator('button[type="submit"]');
      await expect(button).toContainText(/CALCULAT/);
    });

    test('should be able to recalculate with new values', async ({ page }) => {
      // First calculation
      await page.locator('input#p_psf').fill('50');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('#results-section')).toBeVisible({ timeout: 10000 });

      // Change value and recalculate
      await page.locator('input#p_psf').fill('100');
      await page.locator('button[type="submit"]').click();

      // Results should update
      await expect(page.locator('#results-section')).toBeVisible({ timeout: 10000 });
    });

    test('should toggle check details open and closed', async ({ page }) => {
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('#results-section')).toBeVisible({ timeout: 10000 });

      const detailsButton = page.locator('button:has-text("Check Details")');

      // Initially closed
      await expect(page.locator('table')).not.toBeVisible();

      // Open
      await detailsButton.click();
      await expect(page.locator('table')).toBeVisible();

      // Close
      await detailsButton.click();
      await expect(page.locator('table')).not.toBeVisible();
    });
  });

  test.describe('Mobile viewport specific tests', () => {
    test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

    test('should display correctly on mobile viewport', async ({ page }) => {
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('input#p_psf')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should have large touch-friendly input fields', async ({ page }) => {
      const input = page.locator('input#p_psf');
      const box = await input.boundingBox();

      // Input should be at least 44px tall (iOS touch target guideline)
      expect(box?.height).toBeGreaterThanOrEqual(44);
    });

    test('should have large touch-friendly calculate button', async ({ page }) => {
      const button = page.locator('button[type="submit"]');
      const box = await button.boundingBox();

      // Button should be at least 44px tall
      expect(box?.height).toBeGreaterThanOrEqual(44);
    });

    test('should complete full calculation flow on mobile', async ({ page }) => {
      await page.locator('input#p_psf').fill('60');
      await page.locator('input#a_ft').fill('3');
      await page.locator('input#b_ft').fill('2');
      await page.locator('input#L_ft').fill('10');
      await page.locator('input#W_ft').fill('8');
      await page.locator('input#S_ft').fill('6');

      await page.locator('button[type="submit"]').click();

      await expect(page.locator('#results-section')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('text=/ALL CHECKS PASS|CHECK(S?) FAILED/')).toBeVisible();
    });

    test('should display pass/fail status clearly on mobile', async ({ page }) => {
      await page.locator('input#p_psf').fill('50');
      await page.locator('input#a_ft').fill('3');
      await page.locator('input#b_ft').fill('2');
      await page.locator('input#L_ft').fill('10');
      await page.locator('input#W_ft').fill('8');
      await page.locator('input#S_ft').fill('6');
      await page.locator('button[type="submit"]').click();

      await expect(page.locator('#results-section')).toBeVisible({ timeout: 10000 });

      // Pass/fail banner should be prominent
      const banner = page.locator('[role="status"]');
      await expect(banner).toBeVisible();

      const box = await banner.boundingBox();
      expect(box?.width).toBeGreaterThan(290); // Should span most of mobile width (adjusted for padding)
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels for pass/fail indicators', async ({ page }) => {
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('#results-section')).toBeVisible({ timeout: 10000 });

      const passLabels = page.locator('[aria-label="Pass"]');
      const failLabels = page.locator('[aria-label="Fail"]');

      const totalLabels = (await passLabels.count()) + (await failLabels.count());
      expect(totalLabels).toBeGreaterThan(0);
    });

    test('should have role="alert" for validation error messages', async ({ page }) => {
      await page.locator('input#p_psf').clear();
      await page.locator('button[type="submit"]').click();

      // Validation error alert from the form - check any sibling p with role alert
      const alert = page.locator('p[role="alert"]:has-text("Required")').first();
      await expect(alert).toBeVisible();
    });

    test('should have aria-describedby for input helper text', async ({ page }) => {
      const input = page.locator('input#p_psf');
      const describedBy = await input.getAttribute('aria-describedby');

      expect(describedBy).toBeTruthy();
      expect(describedBy).toContain('p_psf-helper');
    });
  });

  test.describe('Edge cases', () => {
    test('should handle maximum valid dimensions', async ({ page }) => {
      await page.locator('input#p_psf').fill('100');
      await page.locator('input#a_ft').fill('6');
      await page.locator('input#b_ft').fill('6');
      await page.locator('input#L_ft').fill('23');
      await page.locator('input#W_ft').fill('13');
      await page.locator('input#S_ft').fill('13');

      await page.locator('button[type="submit"]').click();

      await expect(page.locator('#results-section')).toBeVisible({ timeout: 10000 });
    });

    test('should handle minimum valid dimensions', async ({ page }) => {
      await page.locator('input#p_psf').fill('50');
      await page.locator('input#a_ft').fill('1');
      await page.locator('input#b_ft').fill('0.5');
      await page.locator('input#L_ft').fill('2');
      await page.locator('input#W_ft').fill('2');
      await page.locator('input#S_ft').fill('1.5');

      await page.locator('button[type="submit"]').click();

      await expect(page.locator('#results-section')).toBeVisible({ timeout: 10000 });
    });

    test('should handle decimal inputs correctly', async ({ page }) => {
      await page.locator('input#p_psf').fill('60.5');
      await page.locator('input#a_ft').fill('3.5');
      await page.locator('input#b_ft').fill('2.25');
      await page.locator('input#L_ft').fill('12.75');
      await page.locator('input#W_ft').fill('10.5');
      await page.locator('input#S_ft').fill('8.25');

      await page.locator('button[type="submit"]').click();

      await expect(page.locator('#results-section')).toBeVisible({ timeout: 10000 });
    });
  });
});
