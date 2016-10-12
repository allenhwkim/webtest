'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');

module.exports = {
  name: 'close browser',
  help: 'close browser',
  regExp: /^close browser/,
  func:
    /** must return a Promise, so that it can be chained with next command*/
    function () {
      return Promise.resolve(seleniumWebTestDriver.driver.quit());
    }
};
