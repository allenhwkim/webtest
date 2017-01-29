'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"

module.exports = {
  name: 'verify alert present',
  help: 'verify alert present',
  regExp: new RegExp(`^verify alert [is ]*present`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function() {
    return seleniumWebTestDriver.waitUntil('alertIsPresent')
      .then(el => {
        seleniumWebTestDriver.lastFoundElement = el
      });
  }
};
