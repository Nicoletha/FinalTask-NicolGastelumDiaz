const logger = require('./test/utils/logger');

exports.config = {
    runner: 'local',
    specs: [
        './test/specs/**/*.spec.js'
    ],
    exclude: [],

    // Firefox and Edge run in parallel via maxInstances.
    maxInstances: 2,
    capabilities: [
        {
            browserName: 'firefox'
        },
        {
            browserName: 'MicrosoftEdge'
        }
    ],

    logLevel: 'info',
    bail: 0,
    baseUrl: 'https://www.saucedemo.com',
    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    framework: 'mocha',
    reporters: ['spec'],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    /**
     * Logs the start of every test so the run output is traceable
     * even before any assertion fails.
     * @param {object} test - Mocha test context provided by WebdriverIO.
     */
    beforeTest: function (test) {
        logger.step(`Starting test: "${test.title}"`);
    },

    /**
     * Logs the outcome of every test (pass/fail) with duration,
     * and the error message when a test fails.
     * @param {object} test - Mocha test context.
     * @param {object} context - Test context (unused here).
     * @param {{error: Error, duration: number, passed: boolean}} result
     */
    afterTest: function (test, context, { error, duration, passed }) {
        if (passed) {
            logger.info(`Test passed: "${test.title}" (${duration}ms)`);
        } else {
            logger.error(`Test failed: "${test.title}" - ${error && error.message}`);
        }
    }
};