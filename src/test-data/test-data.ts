import { fakerEN_GB as faker } from '@faker-js/faker';

export type BookingModel = {
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  pricePerNight: number;
  expectedTotal: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export function generateBookingData(): BookingModel {
  const booking = {} as BookingModel;
  booking.roomType = 'Single';
  booking.checkInDate = '05/03/2026';
  booking.checkOutDate = '10/03/2026';
  booking.pricePerNight = 100;
  booking.expectedTotal = 540;
  booking.firstName = faker.person.firstName();
  booking.lastName = faker.person.lastName();
  booking.email = faker.internet.email();
  booking.phoneNumber = faker.phone.number();
  return booking;
}
