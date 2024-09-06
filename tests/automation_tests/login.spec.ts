import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('TC001: Test login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('QA_Engineer', 'FooBar42');
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL('http://localhost:3000/mfa');
});

test('TC002: Test login with incorrect username and correct password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('InvalidUsername', 'FooBar42');
  await page.waitForTimeout(1000);
  await expect(page.locator('text=Invalid Credentials. Please try again.')).toBeVisible();
});

test('TC003: Test login with correct username and incorrect password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('QA_Engineer', 'WrongPassword');
  await page.waitForTimeout(1000);
  await expect(page.locator('text=Invalid Credentials. Please try again.')).toBeVisible();
});

test('TC004: Test login with both username and password incorrect', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('WrongUser', 'WrongPassword');
  await page.waitForTimeout(1000);
  await expect(page.locator('text=Invalid Credentials. Please try again.')).toBeVisible();
});

test('TC005: Test login with empty username and/or password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('', '');
  await page.waitForTimeout(2000);

  const usernameWarningText = await page.evaluate(() => {
    const usernameInput = document.querySelector('input[name="username"]') as HTMLInputElement;
    usernameInput.reportValidity();
    return usernameInput.validationMessage;
  });

  if (usernameWarningText !== 'Συμπληρώστε αυτό το πεδίο.' && usernameWarningText !== 'Please fill out this field.') {
    throw new Error(`Unexpected validation message: ${usernameWarningText}`);
  }

  const isUsernameInvalid = await page.evaluate(() => {
    const usernameInput = document.querySelector('input[name="username"]') as HTMLInputElement;
    return usernameInput && !usernameInput.checkValidity();
  });
  expect(isUsernameInvalid).toBe(true);
});

test('TC006: Test login with trailing spaces', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(' QA_Engineer ', 'FooBar42');
  await page.waitForTimeout(1000);
  await expect(page.locator('text=Invalid Credentials. Please try again.')).toBeVisible();
});

test('TC007: Test login with SQL injection like input', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login("' OR 1=1--", 'FooBar42');
  await page.waitForTimeout(1000);
  await expect(page.locator('text=Invalid Credentials. Please try again.')).toBeVisible();
});
