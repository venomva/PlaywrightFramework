import { Page, Locator, expect } from '@playwright/test';
import { createLogger } from '../utils/logger';
import { waitForPageStable } from '../utils/helpers';

const logger = createLogger('FramesPage');

export class FramesPage {
  readonly page: Page;

  // Locators — on the frames page
  readonly singleIframe: Locator;

  constructor(page: Page) {
    this.page = page;
    // Top-level locators on the frames page itself
    this.singleIframe = page.locator('[data-testid="single-iframe"]');
    // Alt: #single-iframe, //iframe[@id="single-iframe"]
  }

  /**
   * Navigate to the frames page.
   */
  async navigate(): Promise<void> {
    logger.info('Navigating to frames page');
    await this.page.goto('/frames');
    await waitForPageStable(this.page);
    logger.info('Frames page loaded');
  }

  /**
   * Assert the frames page is visible by checking the single iframe.
   */
  async assertFramesPageVisible(): Promise<void> {
    await expect(this.singleIframe).toBeVisible();
    logger.info('Frames page verified — single iframe visible');
  }

  /**
   * Enter text in the input field inside the single iframe,
   * click the "Click me" button, and verify the typed text appears.
   *
   * @param text - The text to type into the iframe's input field
   */
  async typeInIframeAndVerify(text: string): Promise<void> {
    logger.info(`Typing "${text}" in single iframe and verifying`);

    // Switch into the single iframe
    const iframeElement = this.page.locator('[data-testid="single-iframe"]');
    const frame = await iframeElement.contentFrame();

    // Alt locators: #single-iframe, //iframe[@id="single-iframe"]

    // Find the input field inside the iframe
    const inputField = frame.locator('input[type="text"], input:not([type])').first();

    // Type the text
    await inputField.fill(text);
    logger.info(`Filled "${text}" into iframe input`);

    // Click the "Click me" button inside the iframe
    const clickMeButton = frame.locator('button:has-text("Click me")');
    await clickMeButton.click();
    logger.info('Clicked "Click me" button inside iframe');

    // Verify the typed text is displayed after "You typed:"
    // Use getByText which handles text nodes inside elements better than the `text=` pseudo-selector
    const resultParagraph = frame.locator('p').last();
    await expect(resultParagraph).toContainText(`You typed: ${text}`);
    logger.info(`Verified: "You typed: ${text}" is displayed`);
  }
}