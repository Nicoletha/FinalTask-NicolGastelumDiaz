/**
 * Base class inherited by every Page Object in the suite.
 * Centralizes navigation logic, following the Page Object Model (POM)
 * pattern so specs never call `browser.url()` directly.
 */
class Page {
    /**
     * Navigates to a path relative to the configured baseUrl.
     * @param {string} [path='']
     * @returns {Promise<void>}
     */
    open(path = '') {
        return browser.url(path);
    }
}

module.exports = Page;