const Page = require('./page');
const { LOGIN_REDIRECT_TIMEOUT_MS } = require('../test/utils/constants');

/**
 * Page Object for the Login page ('/').
 * Encapsulates locators and the login flow, including the redirect
 * check to /inventory.html that confirms a successful login.
 */
class LoginPage extends Page {
    get inputUsername() {
        return $("//input[@id='user-name']");
    }

    get inputPassword() {
        return $("//input[@id='password']");
    }

    get btnLogin() {
        return $("//input[@value='Login']");
    }

    /**
     * Logs in with the given credentials and waits for the redirect
     * to the inventory page, which confirms the login succeeded.
     * @param {string} username
     * @param {string} password
     * @returns {Promise<void>}
     */
    async login(username, password) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnLogin.click();

        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/inventory.html'),
            { timeout: LOGIN_REDIRECT_TIMEOUT_MS, timeoutMsg: 'Did not redirect to /inventory.html' }
        );
    }

    open() {
        return super.open('/');
    }
}

module.exports = new LoginPage();