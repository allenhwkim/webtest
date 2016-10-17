'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"

module.exports = {
  name: 'verify element not selected',
  help: 'verify element <selector> is not selected',
  regExp: new RegExp(`^verify element ${RE_STR} is not selected`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(selector) {
    return seleniumWebTestDriver.waitUntil('elementIsNotSelected', selector)
      .then(el => seleniumWebTestDriver.lastFoundElement = el);
  }
};
