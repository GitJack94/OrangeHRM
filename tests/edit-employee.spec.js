const path = require('path');
const { test, expect } = require('@playwright/test');
const employeeData = require('./fixtures/employee.json');
const { LoginPage } = require('./pages/login.page');
const { AddEmployeePage } = require('./pages/add-employee.page');
const { EmployeeListPage } = require('./pages/employee-list.page');
const { EmployeeDetailsPage } = require('./pages/employee-details.page');
const { EmployeeApi } = require('./api/employee-api');

test('searches for a new employee and updates job information', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const addEmployeePage = new AddEmployeePage(page);
  const employeeListPage = new EmployeeListPage(page);
  const employeeDetailsPage = new EmployeeDetailsPage(page);
  const employeeApi = new EmployeeApi(page.request);
  const employee = {
    ...employeeData,
    employeeId: `${employeeData.employeeIdPrefix}-${Date.now().toString().slice(-6)}`,
  };

  await loginPage.goto();
  await loginPage.login('Admin', 'admin123');
  await expect(loginPage.dashboardHeading, 'Dashboard should be visible after login').toBeVisible();

  await addEmployeePage.goto();
  await addEmployeePage.createEmployee(
    employee,
    path.join(__dirname, 'fixtures', 'profile-picture.png'),
  );
  await expect(
    addEmployeePage.successToast,
    'Employee setup should complete before editing',
  ).toContainText('Successfully Saved');

  await employeeListPage.goto();
  await employeeListPage.searchByEmployeeId(employee.employeeId);
  await employeeListPage.openEmployee(employee.employeeId);
  await expect(
    page,
    'Searching by Employee ID should open the employee record',
  ).toHaveURL(/\/web\/index\.php\/pim\/viewPersonalDetails\/empNumber\/\d+/);

  await employeeDetailsPage.editJobInformation(
    employee.updatedJobTitle,
    employee.updatedEmploymentStatus,
  );
  await expect(
    employeeDetailsPage.successToast,
    'Job Title and Employment Status should be saved',
  ).toContainText('Successfully Updated');
  await employeeDetailsPage.expectJobInformation(
    employee.updatedJobTitle,
    employee.updatedEmploymentStatus,
  );

  const employeeResponse = await employeeApi.findByEmployeeId(employee.employeeId);
  expect(employeeResponse.ok(), 'Employee lookup API should return HTTP success').toBeTruthy();
  const employeePayload = await employeeResponse.json();
  expect(employeePayload.meta.total, 'API should return exactly one matching employee').toBe(1);
  expect(employeePayload.data[0], 'API identity should match the UI-created employee').toMatchObject({
    employeeId: employee.employeeId,
    firstName: employee.firstName,
    lastName: employee.lastName,
  });

  const employeeNumber = employeePayload.data[0].empNumber;
  const jobResponse = await employeeApi.getJobDetails(employeeNumber);
  expect(jobResponse.ok(), 'Job details API should return HTTP success').toBeTruthy();
  const jobPayload = await jobResponse.json();
  expect(jobPayload.data.jobTitle.title, 'API Job Title should match the updated UI value').toBe(employee.updatedJobTitle);
  expect(jobPayload.data.empStatus.name, 'API Employment Status should match the updated UI value').toBe(employee.updatedEmploymentStatus);

  await employeeListPage.goto();
  await employeeListPage.searchByEmployeeId(employee.employeeId);
  await employeeListPage.deleteEmployee(employee.employeeId);
  await expect(
    page.locator('.oxd-toast--success'),
    'Employee deletion should show a success message',
  ).toContainText('Successfully Deleted');

  await employeeListPage.searchByEmployeeId(employee.employeeId, false);
  await expect(
    employeeListPage.employeeTableRow(employee.employeeId),
    'Deleted employee should no longer appear in the UI list',
  ).toHaveCount(0);

  const deletedEmployeeResponse = await employeeApi.findByEmployeeId(employee.employeeId);
  expect(deletedEmployeeResponse.ok(), 'Post-delete employee API lookup should succeed').toBeTruthy();
  const deletedEmployeePayload = await deletedEmployeeResponse.json();
  expect(deletedEmployeePayload.meta.total, 'API should return no records after deletion').toBe(0);

  await loginPage.logout();
  await expect(page).toHaveURL(
    /\/web\/index\.php\/auth\/login/,
    { message: 'Logout should return to the login page' },
  );
  await expect(loginPage.usernameInput, 'Login form should be visible after logout').toBeVisible();

  const sessionResponse = await page.request.get(
    '/web/index.php/api/v2/pim/employees?limit=1&offset=0',
    { maxRedirects: 0 },
  );
  expect(
    [302, 401, 403],
    'Protected API should reject the invalidated session',
  ).toContain(sessionResponse.status());
});