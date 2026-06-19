import { Page, Locator, expect } from '@playwright/test';
import { createLogger } from '../utils/logger';

const logger = createLogger('BasePage');

/**
 * Base page class providing common functionality for all page objects.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific path relative to the baseURL.
   */
  async navigateTo(path: string): Promise<void> {
    logger.info(`Navigating to: ${path}`);
    await this.page.goto(path);
  }

  /**
   * Get the current page title.
   */
  async getPageTitle(): Promise<string> {
    const title = await this.page.title();
    logger.info(`Page title: ${title}`);
    return title;
  }

  /**
   * Assert the page title contains the expected text.
   */
  async assertTitleContains(expected: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(expected));
    logger.info(`Page title contains: "${expected}"`);
  }

  /**
   * Wait for the page to reach a stable state.
   */
  async waitForStable(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }
}