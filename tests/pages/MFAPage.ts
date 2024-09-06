import { Page } from '@playwright/test';

export class MFAPage {
    page: Page;
    mfaInput = 'input[name="mfaCode"]';
    submitButton = 'button[type="submit"]';
  
    constructor(page: Page) {
        this.page = page;
    }
  
    async enterMfaCode(code: string) {
        await this.page.getByLabel('Enter MFA Code:').fill(code);
        await this.page.click(this.submitButton);
    }
}