import { fakerEN_GB as faker } from '@faker-js/faker';

export type OrderModel = {
  itemName: string;
  firstName: string;
  lastName: string;
  postcode: string;
};

// Define the available items on the SauceDemo site
const sauceItems = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
];

export function generateOrderData(): OrderModel {
  return {
    // Picks a random item from the array above
    itemName: faker.helpers.arrayElement(sauceItems),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postcode: faker.location.zipCode(),
  };
}
