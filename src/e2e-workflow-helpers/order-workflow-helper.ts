/* eslint-disable @typescript-eslint/no-explicit-any */
import test, { expect } from '@playwright/test';
import { OrderModel } from '../test-data/test-data';

// PW tdd cannot share steps like cucumber, which can result in lots of step repetition
// The below is a custom function that takes an e2e flow and allows the user to select a start and end point in the flow
// The values inside are static but as the helper is flexible you 'drop out' the step before
// Make a separate test.step in the spec with your changes that differ from the main flow belore
// Then you can jump back in with the step after your separate test step and carry on
export enum OrderWorkflowStep {
  LoginAsStandardUser = 'Login as Standard User',
  AddItemToCart = 'Add Item to Cart',
  CompleteCheckoutProcess = 'Complete Checkout Process',
  VerifyOrderSuccess = 'Verify Order Success',
}

export async function orderWorkflow(
  params: { testObject: OrderModel; [key: string]: any },
  startStep: OrderWorkflowStep = OrderWorkflowStep.LoginAsStandardUser,
  stopAtStep?: OrderWorkflowStep
) {
  let started = false;

  const steps: [OrderWorkflowStep, () => Promise<void>][] = [
    [
      OrderWorkflowStep.LoginAsStandardUser,
      async () => {
        await test.step('Login as standard user', async () => {
          await params.sauceLabsLoginPage.loginToApplication('standard_user', params.password);
        });
      },
    ],
    [
      OrderWorkflowStep.AddItemToCart,
      async () => {
        await test.step('Add item to cart and navigate to checkout', async () => {
          await params.inventoryPage.addItemToCart(params.testObject.itemName);
          await params.inventoryPage.goToCart();
          await params.cartPage.checkout();
        });
      },
    ],
    [
      OrderWorkflowStep.CompleteCheckoutProcess,
      async () => {
        await test.step('Complete checkout process', async () => {
          await params.checkoutPage.fillInformation(
            params.testObject.firstName,
            params.testObject.lastName,
            params.testObject.postcode
          );
          await params.checkoutPage.finishCheckout();
        });
      },
    ],
    [
      OrderWorkflowStep.VerifyOrderSuccess,
      async () => {
        await test.step('Verify order success message', async () => {
          await expect(params.page.getByText('Thank you for your order!')).toBeVisible();
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
