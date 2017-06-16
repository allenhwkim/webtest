'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"
const RE_STR_WITH_QUOTE = '[\'"]([\\s\\S]+)[\'"]'; //e.g. 'foo bar', "foo bar"

module.exports = {
  name: 'verify element text',
  help: 'verify element <selector> text "<string>"',
  regExp: new RegExp(`^verify element ${RE_STR} text [is ]*${RE_STR_WITH_QUOTE}$`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(selector, text) {
    return webtestDriver
      .waitUntil('elementTextIs', selector, text)
      .then(el => webtestDriver.lastElement = el);
  }
};
