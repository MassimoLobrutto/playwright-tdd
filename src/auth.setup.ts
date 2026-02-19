import { chromium, expect } from '@playwright/test';
import { logger } from './helper/logger/logger';
import path from 'node:path';

async function globalSetup() {
  const browser = await chromium.launch();

  // Define absolute paths for both session files
  const sauceFile = path.resolve(__dirname, '.auth/sauce_user.json');
  const bookerFile = path.resolve(__dirname, '.auth/booker_user.json');

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

  // --- 2. RESTFUL BOOKER SETUP ---
  logger.info('🚀 Starting Restful Booker UI Setup...');
  const bookerContext = await browser.newContext();
  const bookerPage = await bookerContext.newPage();

  await bookerPage.goto('https://automationintesting.online/');
  await bookerPage.getByRole('link', { name: 'Admin', exact: true }).click();
  logger.info(bookerPage.url());
  await bookerPage.getByRole('textbox', { name: 'Username' }).fill('admin');
  await bookerPage.getByRole('textbox', { name: 'Password' }).fill('password');
  await bookerPage.getByRole('button', { name: 'Login' }).click();

  // Wait for the logout button to ensure we are logged in
  await expect(bookerPage.getByText('Room details')).toBeVisible();

  // Capture the state into a variable first
  const state = await bookerContext.storageState();

  // ✅ CHECK: Is there actually data?
  const hasCookies = state.cookies.length > 0;
  const hasStorage = state.origins.some(o => o.localStorage.length > 0);

  if (!hasCookies && !hasStorage) {
    logger.error('❌ ERROR: No cookies or local storage found after login!');
    // Log what the page looks like to help debug
    logger.info(`Current URL: ${bookerPage.url()}`);
  } else {
    logger.info(`✅ Auth data found: ${state.cookies.length} cookies, ${state.origins.length} origins.`);
    await bookerContext.storageState({ path: bookerFile });
    logger.info(`✅ Booker session saved to: ${bookerFile}`);
  }

  await bookerContext.close();

  // Final Cleanup
  await browser.close();
}

export default globalSetup;
