'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_STR_WITH_QUOTE = '[\'"]([\\s\\S]+)[\'"]'; //e.g. 'foo bar', "foo bar"

module.exports = {
  name: 'verify title',
  help: 'verify title "<title>"',
  regExp: new RegExp(`^verify title [is ]*${RE_STR_WITH_QUOTE}`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(title) {
    return webtestDriver.waitUntil('titleIs', title);
  }
};
