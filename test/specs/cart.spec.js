const LoginPage = require('../../pageobjects/login.page');
const InventoryPage = require('../../pageobjects/inventory.page');
const { standardUser } = require('../data/users.data');
const cartDataSets = require('../data/cart-items.data');
const logger = require('../utils/logger');

describe('UC-2: Cart State Logic', () => {

    beforeEach(async () => {
        // Given: a standard user with an empty cart.
        // Local/session storage is cleared before every run so each
        // data set always starts from a clean state.
        logger.step('Given: the user is logged in with an empty cart');
        await LoginPage.open();

        await browser.execute(() => {
            window.localStorage.clear();
            window.sessionStorage.clear();
        });

        await LoginPage.open();
        await LoginPage.login(standardUser.username, standardUser.password);
    });

    cartDataSets.forEach((data) => {
        it(`should update the cart badge correctly (${data.description})`, async () => {
            try {
                // When: two different items are added to the cart
                logger.step(`When: "${data.itemToAdd1}" and "${data.itemToAdd2}" are added to the cart`);
                await InventoryPage.addItemToCart(data.itemToAdd1);
                await InventoryPage.addItemToCart(data.itemToAdd2);

                // Then: the cart badge should show 2 items
                let badgeCount = await InventoryPage.getCartBadgeCount();
                logger.info(`Current badge: ${badgeCount}`);
                expect(badgeCount).toEqual('2');

                // When: one of the added items is removed
                logger.step(`When: "${data.itemToRemove}" is removed from the cart`);
                await InventoryPage.removeItemFromCart(data.itemToRemove);

                // Then: the badge should update to 1
                badgeCount = await InventoryPage.getCartBadgeCount();
                logger.info(`Current badge: ${badgeCount}`);
                expect(badgeCount).toEqual('1');
            } catch (error) {
                logger.error(`Failed on "${data.description}": ${error.message}`);
                throw error;
            }
        });
    });

    it('should hide the cart badge once all items are removed', async () => {
        const data = cartDataSets[0];

        try {
            // Given (inline setup): a cart with two items added
            logger.step(`When: "${data.itemToAdd1}" and "${data.itemToAdd2}" are added to the cart`);
            await InventoryPage.addItemToCart(data.itemToAdd1);
            await InventoryPage.addItemToCart(data.itemToAdd2);

            let badgeCount = await InventoryPage.getCartBadgeCount();
            logger.info(`Current badge: ${badgeCount}`);
            expect(badgeCount).toEqual('2');

            // When: both items are removed, leaving the cart empty
            logger.step(`When: "${data.itemToAdd1}" and "${data.itemToAdd2}" are removed from the cart`);
            await InventoryPage.removeItemFromCart(data.itemToAdd1);
            await InventoryPage.removeItemFromCart(data.itemToAdd2);

            // Then: the badge should no longer exist in the DOM (empty cart)
            logger.step('Then: the cart badge should disappear');
            const cartIsEmpty = await InventoryPage.isCartEmpty();
            logger.info(`Cart is empty: ${cartIsEmpty}`);
            expect(cartIsEmpty).toBe(true);
        } catch (error) {
            logger.error(`Failed validating empty cart: ${error.message}`);
            throw error;
        }
    });
});