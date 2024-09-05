## Introduction

This repository contains the test plan, bug report, and automated tests for the VODA.ai QA Engineer assignment. The automated tests are implemented using Playwright with JavaScript to cover the login flow, Multi-Factor Authentication (MFA) step, and access to authenticated pages.

## Prerequisites

To run the tests, make sure you have the following installed:
  - Node.js (version 12 or later)
  - npm (Node Package Manager)
  - Playwright

## Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone [repository_url]
   cd qa-assignment
   ```
2. **Install the dependencies**
   ```bash
   npm install
   ```
3. **Run the application**
   ```bash
   npx tsc
   npm start
   ```
The application will run on http://localhost:3000.

## Running the Automated Tests

### 1. Ensure the Application is Running:
Before running the automated tests, make sure the application is running locally at http://localhost:3000 as mentioned in the setup instructions above.

### 2. Install Playwright:
   ```bash
   npx tsc
   npm start
   ```
### 3. Run the Tests:
   ```bash
   npm test
   ```
## Test Scenarios Covered

The automated tests cover the following scenarios:

1. **Login Page:**

  - Valid credentials
  - Invalid credentials (e.g., incorrect username/password, missing fields)

2. **MFA Step:**

   -Correct MFA code
   Incorrect MFA code

3. **Authenticated Page Access:**

  - Navigation to an authenticated page with a valid session cookie
  - Attempt to access an authenticated page without a valid session cookie

## Documentation

- [Test Plan and Bug Report](docs/Test%20Plan.pdf): Detailed test cases and identified bugs during manual testing.

If you have any questions or need further clarification, feel free to reach out.

Good luck, and we look forward to reviewing your work!
