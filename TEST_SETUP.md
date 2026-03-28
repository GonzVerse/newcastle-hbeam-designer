# Test Setup Documentation

## Overview
This document describes the testing infrastructure for the NewCastle HBAM Bumpout Designer web application.

## Testing Stack

### Unit & Integration Testing: Vitest
- **Framework**: Vitest 4.1.2
- **Environment**: jsdom (React component testing)
- **Testing Library**: @testing-library/react 16.3.2
- **Coverage Provider**: @vitest/coverage-v8

### End-to-End Testing: Playwright
- **Framework**: Playwright 1.58.2
- **Browsers**: Chromium (Desktop & Mobile/Pixel 5)
- **Base URL**: http://localhost:3000

## Directory Structure

```
newcastle-hbeam-designer/
├── lib/__tests__/                    # Unit tests for calculation logic
│   ├── example.test.ts              # Example test (to be replaced)
│   └── hbam-calculations.test.ts    # [Task #6] HBAM calculation tests
├── components/__tests__/            # Component unit tests
│   └── CalculatorForm.test.tsx     # [Task #6] Form component tests
├── tests/e2e/                       # End-to-end integration tests
│   ├── example.spec.ts             # Example e2e test (to be replaced)
│   └── calculator.spec.ts          # [Task #7] Full user flow tests
├── vitest.config.ts                # Vitest configuration
├── vitest.setup.ts                 # Test setup and global imports
└── playwright.config.ts            # Playwright configuration
```

## Test Scripts

Run tests using the following npm scripts:

```bash
# Unit tests
npm test                    # Run unit tests in watch mode
npm run test:ui            # Run with Vitest UI
npm run test:coverage      # Run with coverage report

# End-to-end tests
npm run test:e2e           # Run Playwright tests
npm run test:e2e:ui        # Run with Playwright UI
```

## Coverage Goals
- **Unit Test Coverage**: >80% for calculation logic
- **Integration Tests**: Full user journey coverage
- **Mobile Testing**: All tests run on mobile viewport (Pixel 5)

## Next Steps

### Task #6: Write Unit Tests for HBAM Calculations
- Test all calculation functions in `/lib/hbam-calculations.ts`
- Test calculator form component
- Achieve >80% coverage

### Task #7: Write Integration Tests
- Test complete user flow: input → API → results display
- Test on both mobile and desktop viewports
- Verify pass/fail display logic

### Task #9: Generate Test Report
- Run full test suite with coverage
- Document test results
- Create build summary for demo

## Configuration Details

### Vitest Configuration
- Alias: `@` points to project root
- Excludes: node_modules, .next, out, config files
- Reporters: text, json, html

### Playwright Configuration
- Projects: Mobile Chrome (Pixel 5), Desktop Chrome
- Dev server: Auto-starts on http://localhost:3000
- Retries: 2 (CI only)
- Trace: on-first-retry

## Notes for QA Engineer
- All test infrastructure is ready for Tasks #6 and #7
- Wait for backend-dev to complete API routes (Task #2) before writing calculation tests
- Wait for frontend-dev to complete UI (Tasks #3, #4) before writing integration tests
- Coordinate with team to ensure all components are testable
