const path = require('path');
const { test, expect } = require('@playwright/test');
const employeeData = require('./fixtures/employee.json');
const { LoginPage } = require('./pages/login.page');
const { AddEmployeePage } = require('./pages/add-employee.page');

test.describe('Employee Lifecycle Management', () => {
  test('adds a new employee from data and uploads a profile picture', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const addEmployeePage = new AddEmployeePage(page);
    const employee = {
      ...employeeData,
      employeeId: `${employeeData.employeeIdPrefix}-${Date.now().toString().slice(-6)}`,
    };

    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
    await expect(loginPage.dashboardHeading, 'Dashboard should be visible after login').toBeVisible();

    await addEmployeePage.goto();
    await expect(page).toHaveURL(
      /\/web\/index\.php\/pim\/addEmployee/,
      { message: 'PIM Add Employee page should open' },
    );
    await addEmployeePage.createEmployee(
      employee,
      path.join(__dirname, 'fixtures', 'profile-picture.png'),
    );

    await expect(
      addEmployeePage.successToast,
      'New employee should be saved successfully',
    ).toContainText('Successfully Saved');
  });
});