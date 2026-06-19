import { test, expect } from '@playwright/test';
import { ShopPage } from '../src/pages/shop.page';
import { CartPage } from '../src/pages/cart.page';
import { SHOP_URLS, PRODUCT_IDS } from '../src/data/test-data';
import { createLogger } from '../src/utils/logger';

const logger = createLogger('EcommerceCartSpec');

test.describe('E-commerce – Add Products and Verify Cart', () => {
  let shopPage: ShopPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    logger.info('Test setup: initializing page objects');
    shopPage = new ShopPage(page);
    cartPage = new CartPage(page);
  });

  test('should add 5 products to cart and verify them in the cart page', async ({ page }) => {
    logger.info('=== Starting: add products and verify cart ===');

    // Step 1: Navigate to home and click the 'E-commerce Flow' link
    await test.step('Navigate to shop via E-commerce Flow link', async () => {
      await page.goto('/');
      await shopPage.clickEcommerceLink();
      await shopPage.assertShopPageVisible();
    });

    // Step 2: Add 5 random products to cart and capture their prices
    const shopPrices = new Map<number, string>();
    await test.step('Add 5 products to cart', async () => {
      await shopPage.addProductsToCart([...PRODUCT_IDS]);
      // Capture each product's price from the shop page for later validation
      for (const id of PRODUCT_IDS) {
        const price = await shopPage.getProductPrice(id);
        shopPrices.set(id, price);
        logger.info(`Captured shop price for product ${id}: ${price}`);
      }
    });

    // Step 3: Verify cart count and confirm products are added
    await test.step('Verify cart count reflects 5 added products', async () => {
      await shopPage.assertCartCount(PRODUCT_IDS.length);
    });

    // Step 4: Click the cart link to navigate to cart page
    await test.step('Click cart link to view cart', async () => {
      await shopPage.clickCartLink();
    });

    // Step 5: Verify URL is the cart page
    await test.step('Verify navigated to cart page URL', async () => {
      await expect(page).toHaveURL(new RegExp(SHOP_URLS.cart));
    });

    // Step 6: Verify same added products are displaying in cart
    await test.step('Verify same 5 products are displayed in cart', async () => {
      await cartPage.assertCartPageVisible();
      await cartPage.assertCartItemCount(PRODUCT_IDS.length);
      await cartPage.assertProductsInCart([...PRODUCT_IDS]);
    });

    // Step 7: Verify product prices in cart match shop page prices
    await test.step('Verify product prices in cart match shop page prices', async () => {
      await cartPage.assertProductPricesInCart(shopPrices);
    });

    logger.info('=== Completed: add products and verify cart ===');
  });
});