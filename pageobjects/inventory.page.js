const Page = require('./page');
const { SORT_DROPDOWN_TIMEOUT_MS } = require('../test/utils/constants');

/**
 * Page Object for the Inventory page (/inventory.html).
 * Encapsulates all locators and interactions for product sorting
 * and cart operations, so specs never touch selectors directly.
 */
class InventoryPage extends Page {
    get sortDropdown() {
        return $("//select[@data-test='product-sort-container']");
    }

    get priceElements() {
        return $$("//div[@data-test='inventory-item-price']");
    }

    get cartBadge() {
        return $("//span[@class='shopping_cart_badge']");
    }

    /**
     * Builds the "Add to cart" button locator for a given product,
     * scoped to that product's card via its visible name.
     * @param {string} itemName - Exact product name as shown in the UI.
     * @returns {WebdriverIO.Element}
     */
    btnAddToCart(itemName) {
        return $(
            `//div[text()='${itemName}']/ancestor::div[@data-test='inventory-item']` +
            `//button[contains(text(),'Add to cart')]`
        );
    }

    /**
     * Builds the "Remove" button locator for a given product,
     * scoped to that product's card via its visible name.
     * @param {string} itemName - Exact product name as shown in the UI.
     * @returns {WebdriverIO.Element}
     */
    btnRemove(itemName) {
        return $(
            `//div[text()='${itemName}']/ancestor::div[@data-test='inventory-item']` +
            `//button[contains(text(),'Remove')]`
        );
    }

    /**
     * Sorts the product list by price, low to high.
     * @returns {Promise<void>}
     */
    async sortByPriceLowToHigh() {
        await this.sortDropdown.waitForDisplayed({ timeout: SORT_DROPDOWN_TIMEOUT_MS });
        await this.sortDropdown.selectByVisibleText('Price (low to high)');
    }

    /**
     * Scrapes every visible product price, in DOM order, as numbers.
     * @returns {Promise<number[]>}
     */
    async getAllPrices() {
        const elements = await this.priceElements;
        const prices = [];

        for (const el of elements) {
            const text = await el.getText();
            prices.push(parseFloat(text.replace('$', '')));
        }

        return prices;
    }

    /**
     * Adds a product to the cart by its visible name.
     * @param {string} itemName
     * @returns {Promise<void>}
     */
    async addItemToCart(itemName) {
        await this.btnAddToCart(itemName).click();
    }

    /**
     * Removes a product from the cart by its visible name.
     * @param {string} itemName
     * @returns {Promise<void>}
     */
    async removeItemFromCart(itemName) {
        await this.btnRemove(itemName).click();
    }

    /**
     * Returns the cart badge count as text, or '0' when the badge
     * is not rendered (empty cart).
     * @returns {Promise<string>}
     */
    async getCartBadgeCount() {
        if (await this.cartBadge.isExisting()) {
            return this.cartBadge.getText();
        }
        return '0';
    }

    /**
     * The cart badge is removed from the DOM entirely when the cart
     * is empty (it does not just show "0"), so emptiness is checked
     * by asserting its absence rather than parsing its text.
     * @returns {Promise<boolean>}
     */
    async isCartEmpty() {
        return !(await this.cartBadge.isExisting());
    }

    open() {
        return super.open('/inventory.html');
    }
}

module.exports = new InventoryPage();