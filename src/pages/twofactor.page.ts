import { Page, Locator, expect } from '@playwright/test';
import { createLogger } from '../utils/logger';
import { waitForPageStable } from '../utils/helpers';

const logger = createLogger('TwoFactorPage');

export class TwoFactorPage {
  readonly page: Page;

  // Locators
  readonly otpInput: Locator;
  readonly verifyButton: Locator;
  readonly backButton: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.otpInput = page.locator('[data-testid="otp-input"]');
    this.verifyButton = page.locator('[data-testid="otp-submit"]');
    this.backButton = page.locator('a:has-text("Back to login")');
    this.heading = page.locator('h1');
  }

  /**
   * Fill in the OTP code.
   */
  async fillOtp(code: string): Promise<void> {
    logger.info(`Filling OTP code: ${code}`);
    await this.otpInput.fill(code);
  }

  /**
   * Click the Verify button to submit the OTP.
   */
  async submitOtp(): Promise<void> {
    logger.info('Clicking Verify button');
    await this.verifyButton.click();
  }

  /**
   * Complete the full 2FA flow: fill OTP → submit.
   */
  async verify(code: string): Promise<void> {
    await this.fillOtp(code);
    await this.submitOtp();
  }

  /**
   * Assert the 2FA page heading is visible.
   */
  async assertTwoFactorPageVisible(): Promise<void> {
    await expect(this.heading).toHaveText('Two-factor authentication');
    logger.info('2FA page heading verified');
  }
}