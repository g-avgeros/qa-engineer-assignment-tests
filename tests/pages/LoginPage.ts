import { Page } from '@playwright/test';

export class LoginPage {
    page: Page;
    usernameInput = 'input[name="username"]';
    passwordInput = 'input[name="password"]';
    submitButton = 'button[type="submit"]';

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('http://localhost:3000');
    }

    async login(username: string, password: string) {
        await this.page.fill(this.usernameInput, username);
        await this.page.fill(this.passwordInput, password);
        await this.page.click(this.submitButton);
    }
}