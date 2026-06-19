import { test, expect } from '@playwright/test';
import { SignupPage } from '../src/pages/signup.page';
import { HomePage } from '../src/pages/home.page';
import { SIGNUP_DATA, APP_URLS, MESSAGES } from '../src/data/test-data';
import { createLogger } from '../src/utils/logger';

const logger = createLogger('SignupSpec');

/**
 * Generate a unique username/email suffix using timestamp to avoid
 * duplicate registration conflicts between test runs.
 */
function getUniqueSuffix(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}

test.describe('Authentication – Registration Flow', () => {
  let signupPage: SignupPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    logger.info('Test setup: initializing page objects');
    signupPage = new SignupPage(page);
    homePage = new HomePage(page);
  });

  test('should create a new account successfully with valid data', async ({ page }) => {
    logger.info('=== Starting: successful registration with valid data ===');

    // Generate unique credentials to avoid duplicate conflicts
    const suffix = getUniqueSuffix();
    const uniqueUsername = `user_${suffix}`;
    const uniqueEmail = `user_${suffix}@testver.com`;

    // Step 1: Navigate to signup page
    await test.step('Navigate to signup page', async () => {
      await signupPage.navigate();
      await signupPage.assertSignupPageVisible();
    });

    // Step 2: Fill in valid registration data
    await test.step('Fill in valid registration data', async () => {
      await signupPage.fillFullName(SIGNUP_DATA.valid.fullName);
      await signupPage.fillUsername(uniqueUsername);
      await signupPage.fillEmail(uniqueEmail);
      await signupPage.fillPassword(SIGNUP_DATA.valid.password);
      await signupPage.fillConfirmPassword(SIGNUP_DATA.valid.confirmPassword);
    });

    // Step 3: Accept terms and conditions
    await test.step('Accept terms and conditions', async () => {
      await signupPage.checkAgreeCheckbox();
    });

    // Step 4: Submit the registration form
    await test.step('Submit registration form', async () => {
      await signupPage.submitSignup();
    });

    // Step 5: Verify successful registration – redirected to home page
    await test.step('Verify successful registration', async () => {
      await homePage.assertHomePageVisible();
      await expect(page).toHaveURL(new RegExp(APP_URLS.home));
    });

    logger.info('=== Completed: successful registration with valid data ===');
  });

  test('should show validation errors when submitting empty form', async ({ page }) => {
    logger.info('=== Starting: validation errors on empty form submission ===');

    // Step 1: Navigate to signup page
    await test.step('Navigate to signup page', async () => {
      await signupPage.navigate();
      await signupPage.assertSignupPageVisible();
    });

    // Step 2: Submit the form without filling any fields
    await test.step('Submit empty registration form', async () => {
      await signupPage.submitSignup();
    });

    // Step 3: Verify validation messages are displayed
    await test.step('Verify validation messages are displayed', async () => {
      await signupPage.assertValidationMessage(MESSAGES.usernameMinLength);
      await signupPage.assertValidationMessage(MESSAGES.emailInvalid);
      await signupPage.assertValidationMessage(MESSAGES.passwordMinLength);
      await signupPage.assertValidationMessage(MESSAGES.termsRequired);
    });

    // Step 4: Verify we stay on the signup page
    await test.step('Verify still on signup page', async () => {
      await expect(page).toHaveURL(new RegExp(APP_URLS.signup));
    });

    logger.info('=== Completed: validation errors on empty form submission ===');
  });

  test('should show error for username shorter than 3 characters', async ({ page }) => {
    logger.info('=== Starting: validation error for short username ===');

    // Step 1: Navigate to signup page
    await test.step('Navigate to signup page', async () => {
      await signupPage.navigate();
      await signupPage.assertSignupPageVisible();
    });

    // Step 2: Fill in data with short username
    await test.step('Fill registration data with short username', async () => {
      await signupPage.fillFullName(SIGNUP_DATA.shortUsername.fullName);
      await signupPage.fillUsername(SIGNUP_DATA.shortUsername.username);
      await signupPage.fillEmail(SIGNUP_DATA.shortUsername.email);
      await signupPage.fillPassword(SIGNUP_DATA.shortUsername.password);
      await signupPage.fillConfirmPassword(SIGNUP_DATA.shortUsername.confirmPassword);
      await signupPage.checkAgreeCheckbox();
    });

    // Step 3: Submit and verify validation error
    await test.step('Submit and verify username validation error', async () => {
      await signupPage.submitSignup();
      await signupPage.assertValidationMessage(MESSAGES.usernameMinLength);
    });

    // Step 4: Verify still on signup page
    await test.step('Verify still on signup page', async () => {
      await expect(page).toHaveURL(new RegExp(APP_URLS.signup));
    });

    logger.info('=== Completed: validation error for short username ===');
  });

  test('should show error for invalid email format', async ({ page }) => {
    logger.info('=== Starting: validation error for invalid email ===');

    // Step 1: Navigate to signup page
    await test.step('Navigate to signup page', async () => {
      await signupPage.navigate();
      await signupPage.assertSignupPageVisible();
    });

    // Step 2: Fill in data with invalid email
    await test.step('Fill registration data with invalid email', async () => {
      await signupPage.fillFullName(SIGNUP_DATA.invalidEmail.fullName);
      await signupPage.fillUsername(SIGNUP_DATA.invalidEmail.username);
      await signupPage.fillEmail(SIGNUP_DATA.invalidEmail.email);
      await signupPage.fillPassword(SIGNUP_DATA.invalidEmail.password);
      await signupPage.fillConfirmPassword(SIGNUP_DATA.invalidEmail.confirmPassword);
      await signupPage.checkAgreeCheckbox();
    });

    // Step 3: Submit and verify validation error
    await test.step('Submit and verify email validation error', async () => {
      await signupPage.submitSignup();
      await signupPage.assertValidationMessage(MESSAGES.emailInvalid);
    });

    // Step 4: Verify still on signup page
    await test.step('Verify still on signup page', async () => {
      await expect(page).toHaveURL(new RegExp(APP_URLS.signup));
    });

    logger.info('=== Completed: validation error for invalid email ===');
  });

  test('should show error for password shorter than 8 characters', async ({ page }) => {
    logger.info('=== Starting: validation error for weak password ===');

    // Step 1: Navigate to signup page
    await test.step('Navigate to signup page', async () => {
      await signupPage.navigate();
      await signupPage.assertSignupPageVisible();
    });

    // Step 2: Fill in data with weak password
    await test.step('Fill registration data with weak password', async () => {
      await signupPage.fillFullName(SIGNUP_DATA.weakPassword.fullName);
      await signupPage.fillUsername(SIGNUP_DATA.weakPassword.username);
      await signupPage.fillEmail(SIGNUP_DATA.weakPassword.email);
      await signupPage.fillPassword(SIGNUP_DATA.weakPassword.password);
      await signupPage.fillConfirmPassword(SIGNUP_DATA.weakPassword.confirmPassword);
      await signupPage.checkAgreeCheckbox();
    });

    // Step 3: Submit and verify validation error
    await test.step('Submit and verify password validation error', async () => {
      await signupPage.submitSignup();
      await signupPage.assertValidationMessage(MESSAGES.passwordMinLength);
    });

    // Step 4: Verify still on signup page
    await test.step('Verify still on signup page', async () => {
      await expect(page).toHaveURL(new RegExp(APP_URLS.signup));
    });

    logger.info('=== Completed: validation error for weak password ===');
  });

  test('should navigate to login page via "Sign in" link', async ({ page }) => {
    logger.info('=== Starting: navigate to login via Sign in link ===');

    // Step 1: Navigate to signup page
    await test.step('Navigate to signup page', async () => {
      await signupPage.navigate();
      await signupPage.assertSignupPageVisible();
    });

    // Step 2: Click the "Sign in" link
    await test.step('Click Sign in link', async () => {
      await signupPage.clickSigninLink();
    });

    // Step 3: Verify we're on the login page
    await test.step('Verify redirected to login page', async () => {
      await expect(page).toHaveURL(new RegExp(APP_URLS.login));
    });

    logger.info('=== Completed: navigate to login via Sign in link ===');
  });
});