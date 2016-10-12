'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR  = '[ ]?([\\S]+)?'; // e.g. foo.bar, "foo.bar", or 'foo.bar'. not "foo bar"
const RE_STR_WITH_QUOTE = '[\'"]([\\s\\S]+)[\'"]'; //e.g. 'foo bar', "foo bar"

module.exports = {
  name: 'verify element text',
  help: 'verify element <selector> text matches "<string>"',
  regExp: new RegExp(`^verify element ${RE_STR} text matches ${RE_STR_WITH_QUOTE}`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(selector, text) {
    return seleniumWebTestDriver
      .waitUntil('elementTextMatches', selector, new RegExp(text))
      .then(el => seleniumWebTestDriver.lastFoundElement = el);
  }
};
