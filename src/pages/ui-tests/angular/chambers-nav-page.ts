import { Locator, Page } from '@playwright/test';

export class ChambersNavPage {
  readonly page: Page;
  readonly breadcrumb: Locator;

  constructor(page: Page) {
    this.page = page;
    this.breadcrumb = page.locator('span.text-secondary');
  }

  async selectAndVerifyMenuSubItem(menuItem: string, subMenuItem: string) {
    await this.page.getByRole('button', { name: menuItem }).click();
    await this.page.getByRole('link', { name: subMenuItem }).click();
  }
}
