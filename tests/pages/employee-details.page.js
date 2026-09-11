class EmployeeDetailsPage {
  constructor(page) {
    this.page = page;
    this.jobTab = page.getByRole('link', { name: 'Job' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.formLoader = page.locator('.oxd-form-loader');
    this.successToast = page.locator('.oxd-toast--success');
  }

  fieldSelect(label) {
    return this.page
      .getByText(label, { exact: true })
      .locator('xpath=following::div[contains(@class, "oxd-select-text")][1]');
  }

  async editJobInformation(jobTitle, employmentStatus) {
    await this.jobTab.click();
    await this.page.waitForURL(/\/web\/index\.php\/pim\/viewJobDetails\/empNumber\/\d+/);
    await this.fieldSelect('Job Title').click();
    await this.page.getByRole('option', { name: jobTitle }).click();
    await this.fieldSelect('Employment Status').click();
    await this.page.getByRole('option', { name: employmentStatus }).click();
    await this.saveButton.click();
    await this.formLoader.waitFor({ state: 'hidden' });
  }

  async expectJobInformation(jobTitle, employmentStatus) {
    await this.page
      .locator('.oxd-form-row')
      .filter({ hasText: 'Job Title' })
      .getByText(jobTitle, { exact: true })
      .waitFor({ state: 'visible' });
    await this.page
      .locator('.oxd-form-row')
      .filter({ hasText: 'Employment Status' })
      .getByText(employmentStatus, { exact: true })
      .waitFor({ state: 'visible' });
  }
}

module.exports = { EmployeeDetailsPage };