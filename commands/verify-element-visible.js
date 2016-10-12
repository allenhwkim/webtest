'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR  = '[ ]?([\\S]+)?'; // e.g. foo.bar, "foo.bar", or 'foo.bar'. not "foo bar"

module.exports = {
  name: 'verify element visible',
  help: 'verify element <selector> is visible"',
  regExp: new RegExp(`^verify element ${RE_STR} is visible`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(selector) {
    return seleniumWebTestDriver.waitUntil('elementIsVisible', selector)
      .then(el => seleniumWebTestDriver.lastFoundElement = el);
  }
};
