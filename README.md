# Testver Playground – Playwright TypeScript Framework

A Playwright test automation framework using **TypeScript** and the **Page Object Model** pattern for the [Testver Playground](https://testplay.testver.com/).

Testing Repo

## 📁 Project Structure

```
Playwright/
├── playwright.config.ts          # Playwright configuration (reporters, browsers, timeouts)
├── package.json                  # Dependencies and scripts
├── tests/
│   └── login.spec.ts            # Sample test: Authentication login flow
├── src/
│   ├── pages/
│   │   ├── base.page.ts         # BasePage – shared page actions
│   │   ├── login.page.ts        # LoginPage – login form interactions
│   │   ├── twofactor.page.ts    # TwoFactorPage – 2FA/OTP interactions
│   │   ├── home.page.ts         # HomePage – home page assertions
│   │   └── index.ts             # Barrel export
│   ├── utils/
│   │   ├── logger.ts            # Structured console logger with log levels
│   │   ├── helpers.ts           # Reusable helpers (modal dismiss, waits, URL assertions)
│   │   └── index.ts             # Barrel export
│   └── data/
│       ├── test-data.ts         # Centralised test data (credentials, URLs, messages)
│       └── index.ts             # Barrel export
├── test-results/                 # JSON results + failure screenshots (auto-generated)
└── playwright-report/            # HTML report (auto-generated)
```

## 🚀 Getting Started

### Install dependencies
```bash
npm install
```

### Install Playwright browsers
```bash
npx playwright install
```

## 🧪 Running Tests

### Run the sample login test (headless)
```bash
npm run test:login
```

### Run with browser visible (headed)
```bash
npm run test:headed -- --grep "should log in successfully"
```

### View HTML report
```bash
npm run test:report
```

## 📊 Reporting

This framework uses **built-in Playwright reporting only** (no third-party libraries):

| Reporter | Output |
|----------|--------|
| **HTML** | `playwright-report/index.html` — open with `npm run test:report` |
| **JSON** | `test-results/results.json` — machine-readable results |
| **List** | Console — real-time progress in terminal |

### Configuration (in `playwright.config.ts`)
```ts
reporter: [
  ['list'],                                               // Console output
  ['html', { open: 'never' }],                           // HTML report
  ['json', { outputFile: 'test-results/results.json' }], // JSON report
],
```

## 🔑 Test Data

Test credentials are in `src/data/test-data.ts`:

| Account | Username | Password | Notes |
|---------|----------|----------|-------|
| Admin | `admin` | `admin123` | Triggers 2FA (OTP: `123456`) |
| Tester | `tester` | `test123` | — |
| Manager | `manager` | `manager123` | — |

## 🏗️ Architecture Highlights

- **Page Object Model** — each page has a dedicated class with typed `Locator` properties
- **`data-testid` selectors** — primary selector strategy for stability
- **Structured logging** — every page action logs with timestamp + context
- **`test.step()`** — each logical action is a named step for readable HTML reports
- **Centralised test data** — credentials, URLs, and expected messages in one file
- **Helpers** — modal dismissal, page stability waits, common assertions
