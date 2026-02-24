import { Locator, Page } from '@playwright/test';

export class ChambersHomePage {
  readonly page: Page;
  readonly cookieButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cookieButton = page.getByRole('button', { name: 'Accept All' });
  }
  async navigateToHomepage() {
    await this.page.goto('https://www.chambers.com/');
    await this.clearCookie();
  }

  async clearCookie() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.cookieButton.click();
  }
}
