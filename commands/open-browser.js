'use strict';
let seleniumWebdriver = require('selenium-webdriver');
var webtestDriver = require('../src/web-test-driver');
const RE_STR  = '[ ]?([\\S]*)';   // e.g. foo.bar, "foo.bar", or 'foo.bar'. not "foo bar"

module.exports = {
  name: 'open browser',
  help: 'open browser <chrome|firefox>',
  regExp: new RegExp(`^open browser${RE_STR}`),
  func:
    /** must return a Promise, so that it can be chained with next command*/
    function(browserName) {
      let window;
      let config = webtestDriver.config;
      let browser = process.env['TRAVIS'] ? 'firefox' : browserName || config.browser.name || 'chrome';

      let builder = new seleniumWebdriver.Builder();
      webtestDriver.driver = builder.forBrowser(browser).build();
      window = webtestDriver.driver.manage().window();

      if (parseInt(config.left) >= 0 && parseInt(config.top) >= 0) {
        window.setPosition(config.left, config.top);
      }
      if (parseInt(config.width) >= 0 && parseInt(config.height) >= 0) {
        window.setSize(config.width,  config.height);
      }

      return webtestDriver.driver;
    }
};
