require('ts-node/register');

const { setHeadlessWhen } = require('@codeceptjs/configure');

setHeadlessWhen(process.env.HEADLESS);

exports.config = {
  tests: 'e2e/**/*.spec.ts',
  output: 'e2e/outputs',
  helpers: {
    Playwright: {
      url: 'http://localhost:8080',
      show: true,
      browser: 'chromium',
      waitForNavigation: 'networkidle0'
    }
  },
  include: {
    I: './steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'restaurant-apps',
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true
    },
    tryTo: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    }
  }
}
