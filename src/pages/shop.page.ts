import { Page, Locator, expect } from '@playwright/test';
import { createLogger } from '../utils/logger';
import { waitForPageStable } from '../utils/helpers';

const logger = createLogger('ShopPage');

export class ShopPage {
  readonly page: Page;

  // Locators
  readonly ecommerceLink: Locator;
  readonly productGrid: Locator;
  readonly resultCount: Locator;
  readonly cartLink: Locator;
  readonly cartCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ecommerceLink = page.locator('[data-testid="nav-shop"]'); // alt: a[href*="/shop"], //a[normalize-space(text())='E-commerce Flow']
    this.productGrid = page.locator('[data-testid="product-grid"]');
    this.resultCount = page.locator('[data-testid="result-count"]');
    this.cartLink = page.locator('[data-testid="cart-link"]'); // alt: a[href*="/shop/cart"]
    this.cartCount = page.locator('[data-testid="cart-count"]');
  }

  /**
   * Navigate to the shop page.
   */
  async navigate(): Promise<void> {
    logger.info('Navigating to shop page');
    await this.page.goto('/shop');
    await waitForPageStable(this.page);
    await this.productGrid.waitFor({ state: 'visible' });
    logger.info('Shop page loaded');
  }

  /**
   * Click the 'E-commerce Flow' sidebar link.
   */
  async clickEcommerceLink(): Promise<void> {
    logger.info('Clicking E-commerce Flow link');
    await this.ecommerceLink.click();
    await waitForPageStable(this.page);
    await this.productGrid.waitFor({ state: 'visible' });
    logger.info('E-commerce Flow page loaded');
  }

  /**
   * Add a product to the cart by its product ID.
   */
  async addProductToCart(productId: number): Promise<void> {
    logger.info(`Adding product ${productId} to cart`);
    const addBtn = this.page.locator(`[data-testid="add-cart-${productId}"]`); // alt: button.add-to-cart[data-id="${productId}"]
    await addBtn.click();
    // Brief wait for the cart count to update
    await this.page.waitForTimeout(500);
    logger.info(`Product ${productId} added to cart`);
  }

  /**
   * Add multiple products to the cart by their IDs.
   */
  async addProductsToCart(productIds: number[]): Promise<void> {
    for (const id of productIds) {
      await this.addProductToCart(id);
    }
    logger.info(`Added ${productIds.length} products to cart`);
  }

  /**
   * Get the product name from a product card.
   */
  async getProductName(productId: number): Promise<string> {
    const card = this.page.locator(`[data-testid="product-card-${productId}"]`);
    const name = await card.locator('h4').textContent();
    return name?.trim() ?? '';
  }

  /**
   * Get the product price from a product card.
   */
  async getProductPrice(productId: number): Promise<string> {
    const card = this.page.locator(`[data-testid="product-card-${productId}"]`);
    const price = await card.locator('strong').textContent();
    return price?.trim() ?? '';
  }

  /**
   * Assert the cart count matches the expected value.
   */
  async assertCartCount(expected: number): Promise<void> {
    await expect(this.cartCount).toHaveText(String(expected));
    logger.info(`Cart count verified: ${expected}`);
  }

  /**
   * Click the cart link to navigate to the cart page.
   */
  async clickCartLink(): Promise<void> {
    logger.info('Clicking cart link');
    await this.cartLink.click();
    await waitForPageStable(this.page);
    logger.info('Navigated to cart page');
  }

  /**
   * Assert the shop page is visible by checking the product grid.
   */
  async assertShopPageVisible(): Promise<void> {
    await expect(this.productGrid).toBeVisible();
    logger.info('Shop page verified');
  }
}