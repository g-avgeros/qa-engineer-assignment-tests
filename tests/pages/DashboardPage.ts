import { Page } from '@playwright/test';

export class DashboardPage {
    page: Page;
    dashboardUrl = 'http://localhost:3000/dashboard';
  
    constructor(page: Page) {
        this.page = page;
    }
  
    async navigate() {
        await this.page.goto(this.dashboardUrl);
    }
  }