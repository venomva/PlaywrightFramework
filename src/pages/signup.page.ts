import { Page, Locator, expect } from '@playwright/test';
import { createLogger } from '../utils/logger';
import { waitForPageStable } from '../utils/helpers';

const logger = createLogger('SignupPage');

export class SignupPage {
  readonly page: Page;

  // Locators - using data-testid as primary selector strategy
  readonly fullNameInput: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly agreeCheckbox: Locator;
  readonly submitButton: Locator;
  readonly signupForm: Locator;
  readonly signinLink: Locator;
  readonly heading: Locator;
  readonly strengthLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fullNameInput = page.locator('[data-testid="fullname-input"]');
    this.usernameInput = page.locator('[data-testid="username-input"]');
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.confirmPasswordInput = page.locator('[data-testid="confirm-input"]');
    this.agreeCheckbox = page.locator('[data-testid="agree-checkbox"]');
    this.submitButton = page.locator('[data-testid="signup-submit"]');
    this.signupForm = page.locator('#signup-form, form[action*="signup"]');
    this.signinLink = page.locator('a:has-text("Sign in")');
    this.heading = page.locator('h1');
    this.strengthLabel = page.locator('#strength-label');
  }

  /**
   * Navigate to the signup page and wait for it to load.
   */
  async navigate(): Promise<void> {
    logger.info('Navigating to signup page');
    await this.page.goto('/auth/signup');
    await waitForPageStable(this.page);
    await this.heading.waitFor({ state: 'visible' });
    logger.info('Signup page loaded');
  }

  /**
   * Fill the full name field.
   */
  async fillFullName(name: string): Promise<void> {
    logger.info(`Filling full name: ${name}`);
    await this.fullNameInput.fill(name);
  }

  /**
   * Fill the username field.
   */
  async fillUsername(username: string): Promise<void> {
    logger.info(`Filling username: ${username}`);
    await this.usernameInput.fill(username);
  }

  /**
   * Fill the email field.
   */
  async fillEmail(email: string): Promise<void> {
    logger.info(`Filling email: ${email}`);
    await this.emailInput.fill(email);
  }

  /**
   * Fill the password field.
   */
  async fillPassword(password: string): Promise<void> {
    logger.info('Filling password');
    await this.passwordInput.fill(password);
  }

  /**
   * Fill the confirm password field.
   */
  async fillConfirmPassword(password: string): Promise<void> {
    logger.info('Filling confirm password');
    await this.confirmPasswordInput.fill(password);
  }

  /**
   * Check the "I accept the Terms" checkbox.
   */
  async checkAgreeCheckbox(): Promise<void> {
    logger.info('Checking terms agreement checkbox');
    await this.agreeCheckbox.check();
  }

  /**
   * Click the "Create account" submit button.
   */
  async submitSignup(): Promise<void> {
    logger.info('Clicking Create account button');
    await this.submitButton.click();
  }

  /**
   * Fill all registration fields and submit.
   */
  async signup(data: {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
  }): Promise<void> {
    await this.navigate();
    await this.fillFullName(data.fullName);
    await this.fillUsername(data.username);
    await this.fillEmail(data.email);
    await this.fillPassword(data.password);
    await this.fillConfirmPassword(data.confirmPassword);
    if (data.agreeToTerms) {
      await this.checkAgreeCheckbox();
    }
    await this.submitSignup();
  }

  /**
   * Assert that the signup page heading is visible.
   */
  async assertSignupPageVisible(): Promise<void> {
    await expect(this.heading).toHaveText('Create account');
    logger.info('Signup page heading verified');
  }

  /**
   * Assert that the password strength label shows the expected text.
   */
  async assertPasswordStrength(expected: string): Promise<void> {
    await expect(this.strengthLabel).toContainText(expected);
    logger.info(`Password strength verified: "${expected}"`);
  }

  /**
   * Assert that a validation error message is visible containing the expected text.
   */
  async assertValidationMessage(expected: string): Promise<void> {
    const body = this.page.locator('body');
    await expect(body).toContainText(expected);
    logger.info(`Validation message verified: "${expected}"`);
  }

  /**
   * Assert that the URL contains the expected path.
   */
  async assertUrlContains(expectedPath: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedPath));
    logger.info(`URL verified: contains "${expectedPath}"`);
  }

  /**
   * Click the "Sign in" link to navigate back to the login page.
   */
  async clickSigninLink(): Promise<void> {
    logger.info('Clicking Sign in link');
    await this.signinLink.click();
  }
}