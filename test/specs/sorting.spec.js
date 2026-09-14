const LoginPage = require('../../pageobjects/login.page');
const InventoryPage = require('../../pageobjects/inventory.page');
const { standardUser } = require('../data/users.data');
const logger = require('../utils/logger');

describe('UC-1: Sorting Validation', () => {

    beforeEach(async () => {
        // Given: a standard user authenticated in the app
        logger.step('Given: the user is logged in to saucedemo with standard_user');
        await LoginPage.open();
        await LoginPage.login(standardUser.username, standardUser.password);
    });

    it('should sort prices in ascending order when selecting "Price (low to high)"', async () => {
        try {
            // When: the "Price (low to high)" sort option is selected
            logger.step('When: "Price (low to high)" is selected from the sort dropdown');
            await InventoryPage.sortByPriceLowToHigh();

            const scrapedPrices = await InventoryPage.getAllPrices();
            logger.info(`Prices scraped from the DOM: [${scrapedPrices.join(', ')}]`);

            // Then: the displayed prices must be sorted in ascending order.
            // A sorted copy of the scraped array is compared against the
            // original array, preserving the order rendered in the DOM.
            logger.step('Then: prices must be sorted from lowest to highest');
            const expectedSortedPrices = [...scrapedPrices].sort((a, b) => a - b);

            expect(scrapedPrices).toEqual(expectedSortedPrices);
            logger.info('Ascending order validation: OK');
        } catch (error) {
            logger.error(`Failed validating price order: ${error.message}`);
            throw error;
        }
    });
});