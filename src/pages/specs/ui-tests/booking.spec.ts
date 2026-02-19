import { test, expect } from '../../../fixtures/fixtures';
import { CalendarLabel } from '../../../pages/ui-tests/home-page';
import { fakerEN_GB as faker } from '@faker-js/faker';

const bookingData = [
  { roomType: 'Single', checkInDate: '05/03/2026', checkOutDate: '10/03/2026', pricePerNight: 100, expectedTotal: 540 },
  {
    roomType: 'Double',
    checkInDate: '05/03/2026',
    checkOutDate: '10/03/2026',
    pricePerNight: 150,
    expectedTotal: 790,
  },
];

test.describe('Room Booking Flow @booking @uiTests @regression', () => {
  for (const data of bookingData) {
    test(`should successfully reserve a ${data.roomType} room`, async ({ page, homepage, roomPage }) => {
      await test.step('Navigate to the homepage', async () => {
        await page.goto('https://automationintesting.online/');
      });

      await test.step('Search for available rooms', async () => {
        await homepage.selectDateUK(data.checkInDate, CalendarLabel.CheckIn);
        await homepage.selectDateUK(data.checkOutDate, CalendarLabel.CheckOut);
        await homepage.checkAvailabilityButton.click();
      });

      await test.step(`Select ${data.roomType} room and verify price per night`, async () => {
        await homepage.bookRoomByType(data.roomType);

        await expect(roomPage.breadcrumb.getByText(data.roomType)).toBeVisible();
        expect(await roomPage.pageTitle.textContent()).toContain(data.roomType);
        expect(await roomPage.getPricePerNight()).toBe(data.pricePerNight);
      });

      await test.step('Verify total price and initiate reservation', async () => {
        expect(await roomPage.getTotalPrice()).toBe(data.expectedTotal);
        await roomPage.reserveNowButton.click();
      });

      await test.step('Fill in the booking form and submit', async () => {
        await roomPage.enterReservationDetails(
          faker.person.firstName(),
          faker.person.lastName(),
          faker.internet.email(),
          faker.phone.number()
        );
        await roomPage.reserveNowButton.click();
      });
    });
  }
});
