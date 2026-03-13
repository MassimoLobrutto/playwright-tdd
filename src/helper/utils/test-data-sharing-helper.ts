/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestInfo } from '@playwright/test';
import { OrderModel } from '../../test-data/test-data';

// This allows a test object to be assigned to pw native testInfo container
export function attachTestObject(testInfo: TestInfo, testObject: OrderModel, key: string): Promise<void> {
  return testInfo
    .attach(key, {
      body: JSON.stringify(testObject),
      contentType: 'application/json',
    })
    .then(() => {
      (testInfo as any as { [k: string]: any })[key] = testObject;
    });
}

// This is used to retrived the stored testObject from the test info container so test data can be shared in between tests in the same spec
export function getTestObject<T = OrderModel>(testInfo: TestInfo, key: string): T {
  return (testInfo as any as { [k: string]: any })[key] as T;
}
