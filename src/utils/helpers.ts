import { Page, Locator, expect } from '@playwright/test';
import { createLogger } from './logger';

const logger = createLogger('Helpers');

/**
 * Dismiss a modal/overlay if one is present on the page.
 * Uses a short timeout so it won't block if no modal exists.
 */
export async function dismissModalIfPresent(page: Page): Promise<void> {
  try {
    const dialog = page.locator('[role="dialog"], .modal, .overlay, .popup');
    if (await dialog.isVisible({ timeout: 2000 })) {
      logger.debug('Modal/overlay detected, attempting to dismiss');
      const closeBtn = dialog.locator(
        'button:has-text("Close"), button:has-text("Accept"), button:has-text("X"), [aria-label="Close"], button:has-text("✕")'
      );
      if (await closeBtn.isVisible({ timeout: 1000 })) {
        await closeBtn.click();
        logger.info('Modal dismissed successfully');
      } else {
        await page.keyboard.press('Escape');
        logger.info('Modal dismissed via Escape key');
      }
    }
  } catch {
    // No modal present — continue
  }
}

/**
 * Wait for a page to reach a stable state after navigation.
 * Waits for DOM content loaded and network idle.
 */
export async function waitForPageStable(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  logger.debug('Page DOM content loaded');
}

/**
 * Assert that the current URL contains the expected path.
 */
export async function assertUrlContains(page: Page, expectedPath: string): Promise<void> {
  await expect(page).toHaveURL(new RegExp(expectedPath));
  logger.info(`URL verified: contains "${expectedPath}"`);
}

/**
 * Assert that a locator's text content equals the expected value.
 */
export async function assertTextEquals(locator: Locator, expected: string): Promise<void> {
  await expect(locator).toHaveText(expected);
  logger.info(`Text verified: "${expected}"`);
}