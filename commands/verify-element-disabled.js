'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"

module.exports = {
  name: 'verify element disabled',
  help: 'verify element <selector> is disabled',
  regExp: new RegExp(`^verify element ${RE_STR} is disabled`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(selector) {
    return seleniumWebTestDriver.waitUntil('elementIsDisabled', selector)
      .then(el => seleniumWebTestDriver.lastFoundElement = el);
  }
};
