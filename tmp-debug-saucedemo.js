const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.saucedemo.com/cart.html');
  const url = page.url();
  const title = await page.title();
  const buttons = await page.locator('button').allTextContents();
  const loginCount = await page.locator('button:has-text("Login")').count();
  const localLogin = await page.getByRole('button', { name: 'Login' }).count();
  const body = await page.locator('body').innerText();
  console.log('URL:', url);
  console.log('Title:', title);
  console.log('Buttons:', JSON.stringify(buttons));
  console.log('LoginCount:', loginCount);
  console.log('LoginRoleCount:', localLogin);
  console.log('BodyStarts:', body.slice(0,1200).replace(/\n/g,' '));
  await browser.close();
})();
