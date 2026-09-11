const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');

test.describe('Employee Lifecycle Management', () => {
  test('logs in with valid credentials and displays the dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');

    await expect(page).toHaveURL(
      /\/web\/index\.php\/dashboard\/index/,
      { message: 'Valid credentials should redirect to the dashboard' },
    );
    await expect(loginPage.dashboardHeading, 'Dashboard should be visible after login').toBeVisible();
  });
});