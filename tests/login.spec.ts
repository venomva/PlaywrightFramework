import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page';
import { TwoFactorPage } from '../src/pages/twofactor.page';
import { HomePage } from '../src/pages/home.page';
import { LOGIN_CREDENTIALS, OTP_DATA, APP_URLS, MESSAGES } from '../src/data/test-data';
import { createLogger } from '../src/utils/logger';

const logger = createLogger('LoginSpec');

test.describe('Authentication – Login Flow', () => {
  let loginPage: LoginPage;
  let twoFactorPage: TwoFactorPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    logger.info('Test setup: initializing page objects');
    loginPage = new LoginPage(page);
    twoFactorPage = new TwoFactorPage(page);
    homePage = new HomePage(page);
  });

  test('should log in successfully with valid credentials and 2FA', async ({ page }) => {
    logger.info('=== Starting: successful login with valid credentials and 2FA ===');

    // Step 1: Navigate to login page
    await test.step('Navigate to login page', async () => {
      await loginPage.navigate();
      await loginPage.assertLoginPageVisible();
    });

    // Step 2: Fill in valid credentials
    await test.step('Fill in valid credentials (admin / admin123)', async () => {
      await loginPage.fillCredentials(
        LOGIN_CREDENTIALS.valid.admin.username,
        LOGIN_CREDENTIALS.valid.admin.password,
      );
    });

    // Step 3: Submit login form
    await test.step('Submit login form', async () => {
      await loginPage.submitLogin();
    });

    // Step 4: Verify 2FA page is displayed
    await test.step('Verify 2FA page is displayed', async () => {
      await twoFactorPage.assertTwoFactorPageVisible();
    });

    // Step 5: Enter OTP and verify
    await test.step('Enter OTP code and verify', async () => {
      await twoFactorPage.verify(OTP_DATA.valid);
    });

    // Step 6: Verify successful login – home page with user pill
    await test.step('Verify successful login on home page', async () => {
      await homePage.assertHomePageVisible();
      await homePage.assertUserLoggedIn('admin');
    });

    // Step 7: Verify page URL is home
    await test.step('Verify URL is home page', async () => {
      await expect(page).toHaveURL(APP_URLS.home);
    });

    logger.info('=== Completed: successful login with valid credentials and 2FA ===');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    logger.info('=== Starting: login with invalid credentials ===');

    // Step 1: Navigate to login page
    await test.step('Navigate to login page', async () => {
      await loginPage.navigate();
      await loginPage.assertLoginPageVisible();
    });

    // Step 2: Fill in invalid credentials
    await test.step('Fill in invalid credentials', async () => {
      await loginPage.fillCredentials(
        LOGIN_CREDENTIALS.invalid.wrongPassword.username,
        LOGIN_CREDENTIALS.invalid.wrongPassword.password,
      );
    });

    // Step 3: Submit and verify error
    await test.step('Submit login and verify error message', async () => {
      await loginPage.submitLogin();
      await loginPage.assertErrorMessageVisible();
    });

    // Step 4: Verify we're still on the login page
    await test.step('Verify still on login page', async () => {
      await expect(page).toHaveURL(new RegExp(APP_URLS.login));
    });

    logger.info('=== Completed: login with invalid credentials ===');
  });
});