import { test, expect, Page } from '@playwright/test';
import { MFAPage } from '../pages/MFAPage';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

const baseUrl = 'http://localhost:3000';

async function loginBeforeMFA(page: Page) {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('QA_Engineer', 'FooBar42');
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(`${baseUrl}/mfa`);
}

test('TC008: Test MFA with valid code', async ({ page }) => {
  await loginBeforeMFA(page);
  const mfaPage = new MFAPage(page);
  await mfaPage.enterMfaCode('1337');
  await page.waitForTimeout(1000);
  const dashboardPage = new DashboardPage(page);
  await expect(page).toHaveURL(dashboardPage.dashboardUrl);
  await expect(page.locator('text=Welcome to your dashboard!')).toBeVisible();
});

test('TC009: Test MFA with invalid code', async ({ page }) => {
  await loginBeforeMFA(page);
  const mfaPage = new MFAPage(page);
  await mfaPage.enterMfaCode('9999');
  await page.waitForTimeout(1000);
  await expect(page.locator('text=Invalid MFA Code. Please try again.')).toBeVisible();
});

test('TC010: Test MFA with empty field', async ({ page }) => {
  await loginBeforeMFA(page);
  const mfaPage = new MFAPage(page);
  await mfaPage.enterMfaCode('');
  await page.waitForTimeout(1000);

  const warningText = await page.evaluate(() => {
    const mfaInput = document.querySelector('input[name="mfaCode"]') as HTMLInputElement;
    mfaInput.reportValidity();
    return mfaInput.validationMessage;
  });
  
  if (warningText !== 'Συμπληρώστε αυτό το πεδίο.' && warningText !== 'Please fill out this field.') {
    throw new Error(`Unexpected validation message: ${warningText}`);
  }

  const isMfaInvalid = await page.evaluate(() => {
    const mfaInput = document.querySelector('input[name="mfaCode"]') as HTMLInputElement;
    return mfaInput && !mfaInput.checkValidity();
  });
  expect(isMfaInvalid).toBe(true);
});

test('TC011: Test MFA with special characters', async ({ page }) => {
  await loginBeforeMFA(page);
  const mfaPage = new MFAPage(page);
  await mfaPage.enterMfaCode('!@#$%^&*()');
  await page.waitForTimeout(1000);
  await expect(page.locator('text=Invalid MFA Code. Please try again.')).toBeVisible();
});

test('TC012: Test access to authenticated page with valid session', async ({ page }) => {
  await loginBeforeMFA(page);
  const mfaPage = new MFAPage(page);
  await mfaPage.enterMfaCode('1337');
  await page.waitForTimeout(1000);
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.navigate();
  await expect(page).toHaveURL(dashboardPage.dashboardUrl);
});

test('TC013: Test access to authenticated page without a session', async ({ page }) => {
  await page.context().clearCookies();
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.navigate();
  await expect(page.locator('text=Unauthorized. Please log in.')).toBeVisible();
});
