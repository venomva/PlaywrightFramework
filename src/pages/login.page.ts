import { Page, Locator, expect } from '@playwright/test';
import { createLogger } from '../utils/logger';
import { waitForPageStable } from '../utils/helpers';

const logger = createLogger('LoginPage');

export class LoginPage {
  readonly page: Page;

  // Locators - using data-testid as primary selector strategy
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberCheckbox: Locator;
  readonly signInButton: Locator;
  readonly loginForm: Locator;
  readonly forgotPasswordLink: Locator;
  readonly createAccountLink: Locator;
  readonly errorMessage: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-testid="username-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.rememberCheckbox = page.locator('[data-testid="remember-checkbox"]');
    this.signInButton = page.locator('[data-testid="login-submit"]');
    this.loginForm = page.locator('#login-form');
    this.forgotPasswordLink = page.locator('a:has-text("Forgot password?")');
    this.createAccountLink = page.locator('a:has-text("Create an account")');
    this.errorMessage = page.locator('.error, [role="alert"], .alert-danger');
    this.heading = page.locator('h1');
  }

  /**
   * Navigate to the login page and wait for it to load.
   */
  async navigate(): Promise<void> {
    logger.info('Navigating to login page');
    await this.page.goto('/auth/login');
    await waitForPageStable(this.page);
    await this.heading.waitFor({ state: 'visible' });
    logger.info('Login page loaded');
  }

  /**
   * Fill in username and password fields.
   */
  async fillCredentials(username: string, password: string): Promise<void> {
    logger.info(`Filling credentials for user: ${username}`);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  /**
   * Check the "Remember me" checkbox.
   */
  async checkRememberMe(): Promise<void> {
    logger.info('Checking Remember Me checkbox');
    await this.rememberCheckbox.check();
  }

  /**
   * Submit the login form by clicking Sign In.
   */
  async submitLogin(): Promise<void> {
    logger.info('Clicking Sign In button');
    await this.signInButton.click();
  }

  /**
   * Complete the full login flow: navigate → fill → submit.
   */
  async login(username: string, password: string): Promise<void> {
    await this.navigate();
    await this.fillCredentials(username, password);
    await this.submitLogin();
  }

  /**
   * Assert that the login page heading is visible.
   */
  async assertLoginPageVisible(): Promise<void> {
    await expect(this.heading).toHaveText('Welcome back 👋');
    logger.info('Login page heading verified');
  }

  /**
   * Assert that an error message is visible after failed login.
   */
  async assertErrorMessageVisible(): Promise<void> {
    // The site shows inline error text containing "Invalid credentials"
    const body = this.page.locator('body');
    await expect(body).toContainText('Invalid credentials');
    logger.info('Error message verified');
  }
}