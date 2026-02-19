import { expect, test } from '../../fixtures/fixtures';
import { bookingWorkflow, BookingWorkflowStep } from '../../e2e-workflow-helpers/booking-workflow-helper';
import { generateBookingData } from '../../test-data/test-data';
import { attachTestObject, getTestObject } from '../../helper/utils/test-data-sharing-helper';

test.describe('Room Booking Flow @booking @uiTests @regression', () => {
  test.beforeEach(async ({ page, homepage }, testInfo) => {
    const bookingData = generateBookingData();
    await attachTestObject(testInfo, bookingData, 'generatedTestObject');
    await bookingWorkflow(
      {
        page,
        homepage,
        testObject: bookingData,
      },
      BookingWorkflowStep.NavigateToHomePage,
      BookingWorkflowStep.SearchForAvailableRooms
    );
  });

  test(`should successfully reserve a single room`, async ({ homepage, roomPage }) => {
    const bookingTestObject = getTestObject(test.info(), 'generatedTestObject');
    await test.step(`Select ${bookingTestObject.roomType} room and verify price per night`, async () => {
      await homepage.bookRoomByType(bookingTestObject.roomType);

      await expect(roomPage.breadcrumb.getByText(bookingTestObject.roomType)).toBeVisible();
      expect(await roomPage.pageTitle.textContent()).toContain(bookingTestObject.roomType);
      expect(await roomPage.getPricePerNight()).toBe(bookingTestObject.pricePerNight);
    });

    await test.step('Verify total price and initiate reservation', async () => {
      expect(await roomPage.getTotalPrice()).toBe(bookingTestObject.expectedTotal);
      await roomPage.reserveNowButton.click();
    });

    await test.step('Fill in the booking form and submit', async () => {
      await roomPage.enterReservationDetails(
        bookingTestObject.firstName,
        bookingTestObject.lastName,
        bookingTestObject.email,
        bookingTestObject.phoneNumber
      );
      await roomPage.reserveNowButton.click();
    });
  });

  test(`should successfully reserve a double room`, async ({ homepage, roomPage }) => {
    const bookingTestObject = getTestObject(test.info(), 'generatedTestObject');
    bookingTestObject.roomType = 'Double';
    bookingTestObject.pricePerNight = 150;
    bookingTestObject.expectedTotal = 790;
    await test.step(`Select ${bookingTestObject.roomType} room and verify price per night`, async () => {
      await homepage.bookRoomByType(bookingTestObject.roomType);

      await expect(roomPage.breadcrumb.getByText(bookingTestObject.roomType)).toBeVisible();
      expect(await roomPage.pageTitle.textContent()).toContain(bookingTestObject.roomType);
      expect(await roomPage.getPricePerNight()).toBe(bookingTestObject.pricePerNight);
    });

    await test.step('Verify total price and initiate reservation', async () => {
      expect(await roomPage.getTotalPrice()).toBe(bookingTestObject.expectedTotal);
      await roomPage.reserveNowButton.click();
    });

    await test.step('Fill in the booking form and submit', async () => {
      await roomPage.enterReservationDetails(
        bookingTestObject.firstName,
        bookingTestObject.lastName,
        bookingTestObject.email,
        bookingTestObject.phoneNumber
      );
      await roomPage.reserveNowButton.click();
    });
  });
});
