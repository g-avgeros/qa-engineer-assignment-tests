## Introduction

This repository contains the test plan, bug report, and automated tests for the VODA.ai QA Engineer assignment. The automated tests are implemented using Playwright with JavaScript to cover the login flow, Multi-Factor Authentication (MFA) step, and access to authenticated pages.

## Prerequisites

To run the tests, make sure you have the following installed:
  - Node.js 
  - npm (Node Package Manager)

## Setup Instructions

1. **Download and Extract the Project:**
  - Download the ZIP file containing the project.
  - Extract the ZIP file to a directory on your computer.

2. **Navigate to the Project Directory:** 
   ```bash
   cd qa-assignment
   ```
3. **Install the dependencies**
   ```bash
   npm install
   ```
4. **Run the application**
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
   npm install playwright
   npm install @playwright/test --save-dev
   ```
### 3. Install TypeScript and Related Packages:
   ```bash
   npm install typescript ts-node @types/node --save-dev
   ```
### 4. Run the Tests:
   ```bash
   npm test
   ```
## Test Scenarios Covered

The automated tests cover the following scenarios:

1. **Login Page:**

  - Valid credentials
  - Invalid credentials (e.g., incorrect username/password, missing fields)

2. **MFA Step:**

  - Correct MFA code
  - Incorrect MFA code

3. **Authenticated Page Access:**

  - Navigation to an authenticated page with a valid session cookie
  - Attempt to access an authenticated page without a valid session cookie

## Documentation

- [Test Plan and Bug Report](docs/Test%20Plan.pdf): Detailed test cases and identified bugs during manual testing.

If you have any questions or need further clarification, feel free to reach out.
