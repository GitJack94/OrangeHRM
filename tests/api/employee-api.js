class EmployeeApi {
  constructor(request) {
    this.request = request;
  }

  async findByEmployeeId(employeeId) {
    const response = await this.request.get('/web/index.php/api/v2/pim/employees', {
      params: { employeeId, limit: 1, offset: 0 },
    });
    return response;
  }

  async getJobDetails(employeeNumber) {
    const endpoint = `/web/index.php/api/v2/pim/employees/${employeeNumber}/job-details`;
    let lastError;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        return await this.request.get(endpoint, { timeout: 10000 });
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  }

}

module.exports = { EmployeeApi };