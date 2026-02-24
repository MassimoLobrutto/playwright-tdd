import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryItem: Locator;
  readonly cartLink: Locator;
  readonly brokenImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItem = page.locator('.inventory_item');
    this.cartLink = page.locator('.shopping_cart_link');
    this.brokenImage = page.locator('img[src*="sl-404"]');
  }

  async addItemToCart(itemName: string) {
    const product = this.inventoryItem.filter({ hasText: itemName });
    await product.getByRole('button', { name: 'Add to cart' }).click();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
