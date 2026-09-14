# Task description

**"Inventory Logic" Flow**

**Focus:** Data validation, sorting algorithms, and state management.

**Launch URL:** [https://www.saucedemo.com/](https://www.saucedemo.com/)

**UC-1 Sorting Validation:**
- Login with standard_user.
- Select "Price (low to high)" from the sort dropdown.
- **Validation:** Scrape the prices of all items on the page and programmatically verify that the array is sorted correctly in ascending order.

**UC-2 Cart State Logic:**
- Add two different items to the cart.
- Verify the cart badge shows "2".
- Remove one item via the "Remove" button on the Inventory page.
- Verify the cart badge updates to "1".

**Technical Requirements:**
- **Tool:** WebDriverIO.
- **Browsers:** Firefox, Edge (Run in Parallel).
- **Pattern:** Page Object Model (POM).
- **Locators:** XPath (Focus on text-based selection).
- **Parametrization:** Use Data Provider for the items being added/removed.
- **Documentation:** Add a README.md explaining the sorting validation logic.

---

## Project overview

This project automates two flows on saucedemo.com's Inventory page using WebdriverIO, Mocha, and the Page Object Model pattern. It covers price sorting validation and cart state logic, configured to run on Firefox and Edge in parallel.

## Architecture

The solution follows the Page Object Model pattern, separating interface interaction (what each page can do) from verification logic (what each test must check). A base class is inherited by every page object, centralizing navigation so no test interacts with the browser directly.

The login flow encapsulates its own locators and exposes a method that also waits for the redirect to the inventory page, confirming the login actually succeeded before continuing. The inventory flow exposes methods for sorting products, scraping prices, and manipulating the cart, keeping that logic out of the tests themselves.

If the saucedemo interface were to change, only the corresponding page objects would need updating — the tests themselves remain untouched.

## BDD approach (Given-When-Then)

Each test scenario is structured around three clear stages, even though the tooling used doesn't enforce a Gherkin syntax the way Cucumber does:

- **Given:** the scenario's precondition (authenticated user, empty cart).
- **When:** the action that triggers the behavior under test.
- **Then:** the verification of the expected result.

Each of these stages is logged through a custom logger, so the flow of the scenario is readable both in the code and in the console output during execution.

## Sorting validation logic

The sorting test first selects the "Price (low to high)" option from the corresponding dropdown. All visible price elements on the page are then scraped, their text extracted, the currency symbol stripped, and each value converted to a number. This builds an array of prices preserving the exact order in which they are rendered in the DOM.

To validate that this order is correct, a copy of that array is generated and sorted in ascending order using a numeric comparison function. That sorted array is then compared against the original array scraped from the page.

If both arrays match, it means the order displayed by the interface was already correctly sorted in ascending order. If any pair of prices were out of order, the comparison would fail, catching the sorting error. This approach validates the actual rendered order against a mathematically correct sort, rather than assuming the interface is working correctly.

## Cart state logic

This part covers two scenarios:

1. **Add two items and remove one.** The cart badge is checked after each action: it must show "2" after both products are added, and update to "1" after one of them is removed. Local and session storage are cleared before each run, ensuring every data set starts from a clean cart and preventing state from leaking between tests.

2. **Edge case: empty cart.** Both products are added and then both removed, verifying that the cart badge disappears entirely from the interface rather than assuming it would show "0". This real application behavior — the badge element is removed entirely once the cart is empty — is explicitly validated instead of assumed.

The product combinations used (which two to add, which one to remove) come from a data provider, allowing the same test logic to run against multiple combinations without duplicating code.

## Locator strategy

Most locators are XPath expressions based on the visible text of elements, as required. A small group of locators — the username and password fields, the login button, the sort dropdown, and the price elements — use attributes instead of text, since those elements either lack visible text or their text isn't unique or stable enough to base selection on. In every case, these remain valid, stable XPath selectors.

## Logging and error handling

A custom, dependency-free logger was added that distinguishes between scenario steps (Given/When/Then), general information, and errors. The test runner configuration also automatically logs the start and outcome of every test, including its duration and, in case of failure, the reason.

Each test wraps its logic in error-handling: if something fails, the error is logged with context before being propagated, so the execution output clearly shows which scenario failed and why.