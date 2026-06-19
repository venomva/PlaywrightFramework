import { Page, Locator, expect } from '@playwright/test';
import { createLogger } from '../utils/logger';
import { waitForPageStable } from '../utils/helpers';

const logger = createLogger('HomePage');

export class HomePage {
  readonly page: Page;

  // Locators
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly themeToggleButton: Locator;
  readonly resetStateButton: Locator;
  readonly userPill: Locator;
  readonly authenticationLink: Locator;
  readonly formElementsLink: Locator;
  readonly buttonsLink: Locator;
  readonly tablesLink: Locator;
  readonly tabsLink: Locator;
  readonly loadersLink: Locator;
  readonly ajaxLink: Locator;
  readonly realtimeLink: Locator;
  readonly framesLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1');
    this.searchInput = page.locator('[data-testid="global-search-input"]');
    this.themeToggleButton = page.locator('[data-testid="theme-toggle"]');
    this.resetStateButton = page.locator('[data-testid="reset-state"]');
    this.userPill = page.locator('[data-testid="user-pill"]');
    this.authenticationLink = page.locator('a:has-text("Authentication")');
    this.formElementsLink = page.locator('a:has-text("Form Elements")');
    this.buttonsLink = page.locator('a:has-text("Buttons & Interactions")');
    this.tablesLink = page.locator('a:has-text("Tables & Grids")');
    this.tabsLink = page.locator('a:has-text("Tabs & Accordions")');
    this.loadersLink = page.locator('a:has-text("Loaders & Waits")');
    this.ajaxLink = page.locator('a:has-text("AJAX & API")');
    this.realtimeLink = page.locator('a:has-text("Real-time / WebSocket")');
    this.framesLink = page.locator('[data-testid="nav-frames"]');
  }

  /**
   * Navigate to the home page.
   */
  async navigate(): Promise<void> {
    logger.info('Navigating to home page');
    await this.page.goto('/');
    await waitForPageStable(this.page);
    await this.heading.waitFor({ state: 'visible' });
    logger.info('Home page loaded');
  }

  /**
   * Assert the home page heading is visible.
   */
  async assertHomePageVisible(): Promise<void> {
    await expect(this.heading).toHaveText('A complete playground for test automation');
    logger.info('Home page heading verified');
  }

  /**
   * Assert a logged-in user's name appears in the user pill button.
   */
  async assertUserLoggedIn(username: string): Promise<void> {
    await expect(this.userPill).toHaveText(username);
    logger.info(`User "${username}" is logged in`);
  }

  /**
   * Assert that the user pill is NOT visible (i.e., user is not logged in).
   */
  async assertUserNotLoggedIn(): Promise<void> {
    await expect(this.userPill).not.toBeVisible();
    logger.info('No user is logged in');
  }

  /**
   * Get all module links visible on the home page.
   */
  async getModuleLinkTexts(): Promise<string[]> {
    const links = this.page.locator('section a:has(h3), section a:has-text("→")');
    const count = await links.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      texts.push(await links.nth(i).textContent() ?? '');
    }
    return texts;
  }

  /**
   * Click the 'iFrames & Windows' navigation link.
   */
  async clickFramesLink(): Promise<void> {
    logger.info('Clicking iFrames & Windows link');
    await this.framesLink.click();
    await waitForPageStable(this.page);
    logger.info('Navigated to iFrames & Windows page');
  }
}