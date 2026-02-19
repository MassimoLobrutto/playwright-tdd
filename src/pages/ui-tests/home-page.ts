import { Locator, Page } from '@playwright/test';
import { logger } from '../../helper/logger/logger';

export enum CalendarLabel {
  CheckIn = 'Check In',
  CheckOut = 'Check Out',
}
export class Homepage {
  readonly page: Page;
  readonly homeLink: Locator;
  readonly roomsLink: Locator;
  readonly bookingLink: Locator;
  readonly amenitiesLink: Locator;
  readonly locationLink: Locator;
  readonly contactLink: Locator;
  readonly adminLink: Locator;
  readonly checkAvailabilityButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeLink = page.getByRole('link', { name: 'Shady Meadows B&B' });
    this.roomsLink = page.getByRole('link', { name: 'Rooms' });
    this.bookingLink = page.getByRole('link', { name: 'Booking' });
    this.amenitiesLink = page.getByRole('link', { name: 'Amenities' });
    this.locationLink = page.getByRole('link', { name: 'Location' });
    this.contactLink = page.getByRole('link', { name: 'Contact' });
    this.adminLink = page.getByRole('link', { name: 'Admin panel' });
    this.checkAvailabilityButton = page.getByRole('button', { name: 'Check Availability' });
  }

  async selectDateUK(dateString: string, calendarLabel: string) {
    // Locate and click the input to open the picker
    // Using the container-based anchor we just verified
    const dateInput = this.page.locator('.col-md-6').filter({ hasText: calendarLabel }).locator('input');

    await dateInput.click();
    logger.info(`📅 Opening calendar for: ${calendarLabel}`);

    // Parse the UK string
    const [day, month, year] = dateString.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);

    // Format components to match the UI: "Wednesday, 18 February"
    const dayName = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(dateObj);
    const monthName = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(dateObj);

    // The Aria-label usually drops the leading zero for days (5 vs 05)
    const accessibleName = `Choose ${dayName}, ${day} ${monthName}`;

    // Handle Month Navigation (if the target isn't visible)
    const targetMonthYear = `${monthName} ${year}`;
    const currentMonthLabel = this.page.locator('.react-datepicker__current-month');

    // Click 'Next' until the target month/year header appears
    while (!(await currentMonthLabel.innerText()).includes(targetMonthYear)) {
      await this.page.getByRole('button', { name: 'Next Month' }).click();
    }

    // Select the specific day
    logger.info(`🖱️ Clicking gridcell: "${accessibleName}" for the year ${year}`);
    await this.page.getByRole('gridcell', { name: accessibleName }).click();
  }

  async bookRoomByType(roomType: string) {
    logger.info(`🏨 Looking for room type: ${roomType}`);

    // 1. Find the card that contains the specific room type heading
    // 2. Locate the 'Book now' link inside that specific card
    const roomCard = this.page.locator('.card').filter({
      has: this.page.getByRole('heading', { name: roomType, exact: true }),
    });

    const bookButton = roomCard.getByRole('link', { name: 'Book now' });

    await bookButton.click();
    logger.info(`✅ Clicked 'Book now' for ${roomType} room`);
  }
}
