import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly zipCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly errorIcon: Locator;
  readonly errorContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.zipCode = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.errorIcon = page.locator('.error_icon');
    this.errorContainer = page.locator('[data-test="error"]');
  }

  async fillInformation(firstname: string, lastname: string, zip: string) {
    await this.firstName.fill(firstname);
    await this.lastName.fill(lastname);
    await this.zipCode.fill(zip);
    await this.continueButton.click();
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async finishCheckout() {
    await this.finishButton.click();
  }
}
