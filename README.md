# OrangeHRM Playwright Tests

End-to-end tests for the OrangeHRM demo site using Playwright and JavaScript.

## Setup

Requirements: Node.js 18 or newer and npm.

Install dependencies and the Chromium browser:

```bash
npm install
npx playwright install chromium
```

## Framework Structure

```text
playwright.config.js       Playwright runner, browser, report, video settings
tests/pages/               Page Object Model classes for UI interactions
tests/api/                 API client classes for authenticated API checks
tests/fixtures/            JSON test data and profile-picture fixture
tests/*.spec.js            Login, employee creation, editing, deletion, and logout tests
```

The framework uses Playwright Test with JavaScript and CommonJS modules. Employee data is loaded from JSON, and each run generates a unique Employee ID.

## Run the tests

```bash
npm test
```

Run a single workflow in Chrome:

```bash
npx playwright test tests/edit-employee.spec.js --headed
```

Run with a visible browser:

```bash
npm run test:headed
```

The employee edit scenario also cross-checks the UI values through OrangeHRM's authenticated API:

- `GET /web/index.php/api/v2/pim/employees?employeeId=<id>`
- `GET /web/index.php/api/v2/pim/employees/<empNumber>/job-details`

The HTML report is generated in `playwright-report` and can be opened with:

```bash
npm run test:report
```

Test videos are recorded for every run under `test-results`.

## Dependency

- `@playwright/test`: browser automation, assertions, test runner, HTML report, screenshots, traces, and video recording.