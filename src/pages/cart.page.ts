import { Page, Locator, expect } from '@playwright/test';
import { createLogger } from '../utils/logger';
import { waitForPageStable } from '../utils/helpers';

const logger = createLogger('CartPage');

export class CartPage {
  readonly page: Page;

  // Locators
  readonly cartTable: Locator;
  readonly cartRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartTable = page.locator('[data-testid="cart-table"]'); // alt: table.table
    this.cartRows = page.locator('[data-testid="cart-table"] tbody tr');
  }

  /**
   * Navigate to the cart page.
   */
  async navigate(): Promise<void> {
    logger.info('Navigating to cart page');
    await this.page.goto('/shop/cart');
    await waitForPageStable(this.page);
    await this.cartTable.waitFor({ state: 'visible' });
    logger.info('Cart page loaded');
  }

  /**
   * Assert the cart page is visible.
   */
  async assertCartPageVisible(): Promise<void> {
    await expect(this.cartTable).toBeVisible();
    logger.info('Cart page verified');
  }

  /**
   * Get the number of items in the cart.
   */
  async getCartItemCount(): Promise<number> {
    const count = await this.cartRows.count();
    logger.info(`Cart has ${count} items`);
    return count;
  }

  /**
   * Get the product name from a cart row by product ID.
   */
  async getCartItemName(productId: number): Promise<string> {
    const row = this.page.locator(`[data-testid="cart-row-${productId}"]`);
    const name = await row.locator('strong').textContent();
    return name?.trim() ?? '';
  }

  /**
   * Get the product price from a cart row by product ID.
   */
  async getCartItemPrice(productId: number): Promise<string> {
    const row = this.page.locator(`[data-testid="cart-row-${productId}"]`);
    const cells = row.locator('td');
    const price = await cells.nth(1).textContent();
    return price?.trim() ?? '';
  }

  /**
   * Verify that specific product IDs are present in the cart.
   */
  async assertProductsInCart(productIds: number[]): Promise<void> {
    for (const id of productIds) {
      const row = this.page.locator(`[data-testid="cart-row-${id}"]`);
      await expect(row).toBeVisible();
      logger.info(`Product ${id} verified in cart`);
    }
  }

  /**
   * Verify that the cart contains exactly the expected number of items.
   */
  async assertCartItemCount(expected: number): Promise<void> {
    const count = await this.getCartItemCount();
    expect(count).toBe(expected);
    logger.info(`Cart item count verified: ${expected}`);
  }

  /**
   * Verify that the prices in the cart match the expected prices from the shop page.
   * @param expectedPrices - Map of productId to price string (as captured from shop page)
   */
  async assertProductPricesInCart(expectedPrices: Map<number, string>): Promise<void> {
    for (const [productId, expectedPrice] of expectedPrices) {
      const cartPrice = await this.getCartItemPrice(productId);
      expect(cartPrice).toBe(expectedPrice);
      logger.info(`Product ${productId} price verified in cart: ${cartPrice}`);
    }
    logger.info(`All ${expectedPrices.size} product prices verified in cart`);
  }
}