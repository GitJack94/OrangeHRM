class AddEmployeePage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.employeeIdInput = page
      .locator('label')
      .filter({ hasText: 'Employee Id' })
      .locator('xpath=following::input[1]');
    this.profilePictureInput = page.locator('input[type="file"]');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.formLoader = page.locator('.oxd-form-loader');
    this.successToast = page.locator('.oxd-toast--success');
  }

  async goto() {
    await this.page.goto('/web/index.php/pim/addEmployee');
  }

  async createEmployee(employee, profilePicturePath) {
    await this.firstNameInput.fill(employee.firstName);
    await this.lastNameInput.fill(employee.lastName);
    await this.employeeIdInput.fill(employee.employeeId);
    await this.profilePictureInput.setInputFiles(profilePicturePath);
    await this.formLoader.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    await this.saveButton.click({ force: true });
  }
}

module.exports = { AddEmployeePage };