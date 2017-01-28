'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"

module.exports = {
  name: 'verify alert is present',
  help: 'verify alert is present',
  regExp: new RegExp(`^verify alert is disabled`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function() {
    return seleniumWebTestDriver.waitUntil('alertIsPresent')
      .then(el => {
        seleniumWebTestDriver.lastFoundElement = el
      });
  }
};
