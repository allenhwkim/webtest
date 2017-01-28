'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"

module.exports = {
  name: 'verify element present',
  help: 'verify element <selector> present',
  regExp: new RegExp(`^verify element ${RE_STR} present`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function(selector) {
      return seleniumWebTestDriver.driver.wait(function () {
        return seleniumWebTestDriver.driver.findElements({css: selector})
          .then(listOfEl => listOfEl.length !== 0 );
      }, seleniumWebTestDriver.config.timeout);
    }
};
