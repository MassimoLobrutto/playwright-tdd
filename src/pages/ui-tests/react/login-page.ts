import { Locator, Page } from '@playwright/test';

export class SauceLabsLoginPage {
  readonly page: Page;
  readonly usernameTextbox: Locator;
  readonly passwordTextbox: Locator;
  readonly loginButton: Locator;
  readonly errorContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameTextbox = page.getByPlaceholder('Username');
    this.passwordTextbox = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorContainer = page.locator('[data-test="error"]');
  }

  async loginToApplication(username: string) {
    await this.usernameTextbox.fill(username);
    await this.passwordTextbox.fill('secret_sauce');
    await this.loginButton.click();
  }
}
