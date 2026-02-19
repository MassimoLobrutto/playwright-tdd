import { Locator, Page } from '@playwright/test';

export class RoomPage {
  readonly page: Page;
  readonly breadcrumb: Locator;
  readonly pageTitle: Locator;
  readonly pricePerNightText: Locator;
  readonly totalPriceText: Locator;
  readonly reserveNowButton: Locator;
  readonly firstnameTextbox: Locator;
  readonly lastnameTextbox: Locator;
  readonly emailTextbox: Locator;
  readonly phoneNumberTextbox: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.breadcrumb = page.getByLabel('breadcrumb');
    this.pageTitle = page.getByRole('heading').first();
    this.pricePerNightText = page.getByText(/£\d+\s*per night/);
    this.totalPriceText = page.getByText(/Total£(\d+)/);
    this.reserveNowButton = page.getByRole('button', { name: 'Reserve now' });
    this.firstnameTextbox = page.getByRole('textbox', { name: 'Firstname' });
    this.lastnameTextbox = page.getByRole('textbox', { name: 'Lastname' });
    this.emailTextbox = page.getByRole('textbox', { name: 'Email' });
    this.phoneNumberTextbox = page.getByRole('textbox', { name: 'Phone' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async getPricePerNight(): Promise<number> {
    const text = await this.pricePerNightText.textContent();
    const match = text?.match(/£(\d+)\s*per night/);
    return match ? Number.parseInt(match[1], 10) : 0;
  }

  async getTotalPrice(): Promise<number> {
    const text = await this.totalPriceText.textContent();
    const match = text?.match(/Total£(\d+)/);
    return match ? Number.parseInt(match[1], 10) : 0;
  }

  async enterReservationDetails(firstname: string, lastname: string, email: string, phone: string) {
    await this.firstnameTextbox.fill(firstname);
    await this.lastnameTextbox.fill(lastname);
    await this.emailTextbox.fill(email);
    await this.phoneNumberTextbox.fill(phone);
  }
}
