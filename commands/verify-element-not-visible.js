'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR  = '[ ]?([\\S]+)?'; // e.g. foo.bar, "foo.bar", or 'foo.bar'. not "foo bar"

module.exports = {
  name: 'verify element not visible',
  help: 'verify element <selector> is not visible',
  regExp: new RegExp(`^verify element ${RE_STR} is not visible`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(selector) {
    return seleniumWebTestDriver.waitUntil('elementIsNotVisible', selector)
      .then(el => seleniumWebTestDriver.lastFoundElement = el);
  }
};
