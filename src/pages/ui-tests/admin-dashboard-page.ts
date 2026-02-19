import { Locator, Page } from '@playwright/test';

export class AdminDashboardPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly roomsLink: Locator;
  readonly reportLink: Locator;
  readonly brandingLink: Locator;
  readonly messagesLink: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole('link', { name: 'Restful Booker Platform Demo' });
    this.roomsLink = page.getByRole('link', { name: 'Rooms' });
    this.reportLink = page.getByRole('link', { name: 'Reports' });
    this.brandingLink = page.getByRole('link', { name: 'Branding' });
    this.messagesLink = page.getByRole('link', { name: 'Messages' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
  }
}
