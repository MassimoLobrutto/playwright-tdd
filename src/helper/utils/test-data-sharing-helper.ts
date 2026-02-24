/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestInfo } from '@playwright/test';
import { OrderModel } from '../../test-data/test-data';

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

export function getTestObject<T = OrderModel>(testInfo: TestInfo, key: string): T {
  return (testInfo as any as { [k: string]: any })[key] as T;
}
