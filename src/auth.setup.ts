import { chromium } from '@playwright/test';
import { logger } from './helper/logger/logger';
import path from 'node:path';

// Global setup can be used to execute scripts and functions before the tests run
// In the case below it logs into the site and stores the cookies
// Then in the test the cookies can be reused to bypass logins and save time
async function globalSetup() {
  const browser = await chromium.launch();

  // Define absolute paths for both session files
  const sauceFile = path.resolve(__dirname, '.auth/sauce_user.json');

  // --- 1. SAUCE LABS SETUP ---
  logger.info('🚀 Starting SauceLabs UI Setup...');
  const sauceContext = await browser.newContext();
  const saucePage = await sauceContext.newPage();

  await saucePage.goto('https://www.saucedemo.com/');
  await saucePage.locator('[data-test="username"]').fill('standard_user');
  await saucePage.locator('[data-test="password"]').fill('secret_sauce');
  await saucePage.locator('[data-test="login-button"]').click();
  await saucePage.waitForURL('**/inventory.html');

  await sauceContext.storageState({ path: sauceFile });
  await sauceContext.close();
  logger.info(`✅ SauceLabs session saved to: ${sauceFile}`);

  // Final Cleanup
  await browser.close();
}

export default globalSetup;
