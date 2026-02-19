/* eslint-disable @typescript-eslint/no-explicit-any */
import test, { expect } from '@playwright/test';
import { CalendarLabel } from '../pages/ui-tests/home-page';
import { BookingModel } from '../test-data/test-data';

export enum BookingWorkflowStep {
  NavigateToHomePage = 'Navigate to Home Page',
  SearchForAvailableRooms = 'Search for Available Rooms',
  SelectRoomAndVerifyPrice = 'Select Room and Verify Price',
  VerifyTotalPriceAndInitiateReservation = 'Verify Total Price and Initiate Reservation',
  FillInBookingFormAndSubmit = 'Fill in Booking Form and Submit',
}

export async function bookingWorkflow(
  params: { testObject: BookingModel; [key: string]: any },
  startStep: BookingWorkflowStep = BookingWorkflowStep.NavigateToHomePage,
  stopAtStep?: BookingWorkflowStep
) {
  let started = false;

  const steps: [BookingWorkflowStep, () => Promise<void>][] = [
    [
      BookingWorkflowStep.NavigateToHomePage,
      async () => {
        await test.step('Navigate to the homepage', async () => {
          await params.page.goto('https://automationintesting.online/');
        });
      },
    ],
    [
      BookingWorkflowStep.SearchForAvailableRooms,
      async () => {
        await test.step('Search for available rooms', async () => {
          await params.homepage.selectDateUK(params.testObject.checkInDate, CalendarLabel.CheckIn);
          await params.homepage.selectDateUK(params.testObject.checkOutDate, CalendarLabel.CheckOut);
          await params.homepage.checkAvailabilityButton.click();
        });
      },
    ],
    [
      BookingWorkflowStep.SelectRoomAndVerifyPrice,
      async () => {
        await test.step(`Select ${params.testObject.roomType} room and verify price per night`, async () => {
          await params.homepage.bookRoomByType(params.testObject.roomType);
          await expect(params.roomPage.breadcrumb.getByText(params.testObject.roomType)).toBeVisible();
          expect(await params.roomPage.pageTitle.textContent()).toContain(params.testObject.roomType);
          expect(await params.roomPage.getPricePerNight()).toBe(params.testObject.pricePerNight);
        });
      },
    ],
    [
      BookingWorkflowStep.VerifyTotalPriceAndInitiateReservation,
      async () => {
        await test.step('Verify total price and initiate reservation', async () => {
          expect(await params.roomPage.getTotalPrice()).toBe(params.testObject.expectedTotal);
          await params.roomPage.reserveNowButton.click();
        });
      },
    ],
    [
      BookingWorkflowStep.FillInBookingFormAndSubmit,
      async () => {
        await test.step('Fill in the booking form and submit', async () => {
          // Use the pre-generated data from the model instead of calling faker here
          await params.roomPage.enterReservationDetails(
            params.testObject.firstName,
            params.testObject.lastName,
            params.testObject.email,
            params.testObject.phoneNumber
          );
          await params.roomPage.reserveNowButton.click();
        });
      },
    ],
  ];

  for (const [step, action] of steps) {
    if (!started && step === startStep) started = true;
    if (!started) continue;

    await action();

    if (stopAtStep && step === stopAtStep) break;
  }
}
