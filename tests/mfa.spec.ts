import { test, expect, Page } from '@playwright/test';

const baseUrl = 'http://localhost:3000';

// Helper function to perform login before MFA
async function loginBeforeMFA(page: Page) {
  await page.waitForTimeout(1000);
  await page.goto(`${baseUrl}`);
  await page.waitForTimeout(1000);
  await page.fill('input[name="username"]', 'QA_Engineer'); 
  await page.fill('input[name="password"]', 'FooBar42'); 
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(`${baseUrl}/mfa`);
}

test('TC008: Test MFA with valid code', async ({ page }) => {
  await loginBeforeMFA(page);
  await page.getByLabel('Enter MFA Code:').fill('1337'); 
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(`${baseUrl}/dashboard`); 
  await expect(page.locator('text=Welcome to your dashboard!')).toBeVisible(); 
});

test('TC009: Test MFA with invalid code', async ({ page }) => {
  await loginBeforeMFA(page);
  await page.getByLabel('Enter MFA Code:').fill('9999');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await expect(page.locator('text=Invalid MFA Code. Please try again.')).toBeVisible();
});

test('TC010: Test MFA with empty field', async ({ page }) => {
  await loginBeforeMFA(page);
  await page.getByLabel('Enter MFA Code:').fill(''); 
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000); 

  const warningText = await page.evaluate(() => {
      const mfaInput = document.querySelector('input[name="mfaCode"]') as HTMLInputElement;
      mfaInput.reportValidity();  
      
      return mfaInput.validationMessage; 
  });
  expect(warningText).toBe('Συμπληρώστε αυτό το πεδίο.');

  const isMfaInvalid = await page.evaluate(() => {
      const mfaInput = document.querySelector('input[name="mfaCode"]') as HTMLInputElement;
      return mfaInput && !mfaInput.checkValidity();
  });
  expect(isMfaInvalid).toBe(true);
});

test('TC011: Test MFA with special characters', async ({ page }) => {
  await loginBeforeMFA(page);
  await page.getByLabel('Enter MFA Code:').fill('!@#$%^&*()');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await expect(page.locator('text=Invalid MFA Code. Please try again.')).toBeVisible();
});

test('TC012: Test access to authenticated page with valid session', async ({ page }) => {
  await loginBeforeMFA(page);
  await page.getByLabel('Enter MFA Code:').fill('1337'); 
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  await page.goto(`${baseUrl}/dashboard`); 
});

test('TC013: Test access to authenticated page without a session', async ({ page }) => {
  await page.context().clearCookies(); 
  await page.goto(`${baseUrl}/dashboard`);
  await expect(page.locator('text=Unauthorized. Please log in.')).toBeVisible(); 
});

