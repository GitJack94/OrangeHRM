class EmployeeListPage {
  constructor(page) {
    this.page = page;
    this.employeeIdInput = page
      .getByText('Employee Id', { exact: true })
      .locator('xpath=following::input[1]');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.employeeTableRow = (employeeId) => page.locator('.oxd-table-row').filter({ hasText: employeeId });
  }

  async goto() {
    await this.page.goto('/web/index.php/pim/viewEmployeeList');
  }

  async searchByEmployeeId(employeeId, expectResult = true) {
    await this.employeeIdInput.fill(employeeId);
    await this.searchButton.click();
    if (expectResult) {
      await this.employeeTableRow(employeeId).waitFor({ state: 'visible' });
    }
  }

  async openEmployee(employeeId) {
    await this.employeeTableRow(employeeId).click();
  }

  async deleteEmployee(employeeId) {
    const row = this.employeeTableRow(employeeId);
    await row.getByRole('button').last().click();
    await this.page.getByRole('button', { name: 'Yes, Delete' }).click();
  }
}

module.exports = { EmployeeListPage };