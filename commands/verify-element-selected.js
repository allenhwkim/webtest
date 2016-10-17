'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"

module.exports = {
  name: 'verify element selected',
  help: 'verify element <selector> is selected',
  regExp: new RegExp(`^verify element ${RE_STR} is selected`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(selector) {
    return seleniumWebTestDriver.waitUntil('elementIsSelected', selector)
      .then(el => seleniumWebTestDriver.lastFoundElement = el);
  }
};
