import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/home.page';
import { FramesPage } from '../src/pages/frames.page';
import { APP_URLS, MESSAGES } from '../src/data/test-data';
import { createLogger } from '../src/utils/logger';

const logger = createLogger('FramesInteractiveSpec');

test.describe('iFrames & Windows – Interactive Frame Test', () => {
  let homePage: HomePage;
  let framesPage: FramesPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Test setup: initializing page objects');
    homePage = new HomePage(page);
    framesPage = new FramesPage(page);
  });

  test('should enter text in iframe, click button, and verify typed text is displayed', async ({ page }) => {
    const inputText = 'frame';
    logger.info('=== Starting: iframe interactive text input and verification ===');

    // Step 1: Navigate to home page
    await test.step('Navigate to home page', async () => {
      await homePage.navigate();
      await homePage.assertHomePageVisible();
    });

    // Step 2: Click the 'iFrames & Windows' link
    await test.step('Click iFrames & Windows link', async () => {
      await homePage.clickFramesLink();
      // Verify we're on the frames page
      await expect(page).toHaveURL(new RegExp(APP_URLS.frames));
    });

    // Step 3: Verify frames page is visible
    await test.step('Verify frames page is visible', async () => {
      await framesPage.assertFramesPageVisible();
    });

    // Step 4: Enter text in the iframe, click button, and verify result
    await test.step(`Type "${inputText}" in iframe input, click "Click me", verify text displayed`, async () => {
      await framesPage.typeInIframeAndVerify(inputText);
    });

    logger.info('=== Completed: iframe interactive text input and verification ===');
  });
});