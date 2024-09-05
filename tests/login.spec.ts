import { test, expect } from '@playwright/test';

const baseUrl = 'http://localhost:3000';

test('TC001: Test login with valid credentials', async ({ page }) => {
  await page.goto(`${baseUrl}`);
  await page.fill('input[name="username"]', 'QA_Engineer'); 
  await page.fill('input[name="password"]', 'FooBar42'); 
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(`${baseUrl}/mfa`); 
});

test('TC002: Test login with incorrect username and correct password', async ({ page }) => {
  await page.goto(`${baseUrl}`);
  await page.fill('input[name="username"]', 'InvalidUsername'); 
  await page.fill('input[name="password"]', 'FooBar42'); 
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await expect(page.locator('text=Invalid Credentials. Please try again.')).toBeVisible();
});

test('TC003: Test login with correct username and incorrect password', async ({ page }) => {
  await page.goto(`${baseUrl}`);
  await page.fill('input[name="username"]', 'QA_Engineer'); 
  await page.fill('input[name="password"]', 'WrongPassword'); 
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await expect(page.locator('text=Invalid Credentials. Please try again.')).toBeVisible();
});

test('TC004: Test login with both username and password incorrect', async ({ page }) => {
  await page.goto(`${baseUrl}`);
  await page.fill('input[name="username"]', 'WrongUser'); 
  await page.fill('input[name="password"]', 'WrongPassword'); 
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await expect(page.locator('text=Invalid Credentials. Please try again.')).toBeVisible();
});

test('TC005: Test login with empty username and/or password', async ({ page }) => {
  await page.goto(`${baseUrl}`);
  await page.fill('input[name="username"]', ''); 
  await page.fill('input[name="password"]', ''); 
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  const usernameWarningText = await page.evaluate(() => {
    const usernameInput = document.querySelector('input[name="username"]') as HTMLInputElement;
    usernameInput.reportValidity();  
    return usernameInput.validationMessage; 
  });
  expect(usernameWarningText).toBe('Συμπληρώστε αυτό το πεδίο.');

  const isUsernameInvalid = await page.evaluate(() => {
    const usernameInput = document.querySelector('input[name="username"]') as HTMLInputElement;
    return usernameInput && !usernameInput.checkValidity();
  });
  expect(isUsernameInvalid).toBe(true);
});

test('TC006: Test login with trailing spaces', async ({ page }) => {
  await page.goto(`${baseUrl}`);
  await page.fill('input[name="username"]', ' QA_Engineer '); 
  await page.fill('input[name="password"]', 'FooBar42'); 
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await expect(page.locator('text=Invalid Credentials. Please try again.')).toBeVisible();
});

test('TC007: Test login with SQL injection like input', async ({ page }) => {
  await page.goto(`${baseUrl}`);
  await page.fill('input[name="username"]', "' OR 1=1--"); 
  await page.fill('input[name="password"]', 'FooBar42'); 
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await expect(page.locator('text=Invalid Credentials. Please try again.')).toBeVisible();
});
