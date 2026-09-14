/**
 * Minimal, dependency-free logger for the WebdriverIO test suite.
 * Timestamps every message and distinguishes BDD steps (Given/When/Then)
 * from general info and error output, so the console log reads as a
 * readable trace of each scenario.
 */

/**
 * Returns the current time formatted as HH:MM:SS.mmm for log prefixes.
 * @returns {string}
 */
function timestamp() {
    return new Date().toISOString().split('T')[1].replace('Z', '');
}

module.exports = {
    /**
     * Logs a BDD step (Given/When/Then) inside a test.
     * @param {string} message
     */
    step(message) {
        console.log(`[${timestamp()}] [STEP] ${message}`);
    },

    /**
     * Logs general information (intermediate values, results).
     * @param {string} message
     */
    info(message) {
        console.log(`[${timestamp()}] [INFO] ${message}`);
    },

    /**
     * Logs an error, typically right before re-throwing it.
     * @param {string} message
     */
    error(message) {
        console.error(`[${timestamp()}] [ERROR] ${message}`);
    }
};