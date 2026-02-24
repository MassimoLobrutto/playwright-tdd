import { Locator, Page } from '@playwright/test';

export class ChambersResearchTeamPage {
  readonly page: Page;
  readonly nameField: Locator;
  readonly guideField: Locator;
  readonly titleRegionContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameField = page.getByPlaceholder('Search by first or last name');
    this.guideField = page.getByPlaceholder('Guides');
    this.titleRegionContainer = page.locator('.search-results__title');
  }

  async enterName(name: string) {
    const searchInput = this.nameField;
    await searchInput.fill(name);
    await searchInput.press('Enter');
  }

  async selectGuide(guide: string) {
    const dropdown = this.page.locator('select').first();
    await dropdown.selectOption({ label: guide });
  }
}
