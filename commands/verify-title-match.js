'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_STR_WITH_QUOTE = '[\'"]([\\s\\S]+)[\'"]'; //e.g. 'foo bar', "foo bar"

module.exports = {
  name: 'verify title match',
  help: 'verify title matches "<title>"',
  regExp: new RegExp(`^verify title matches [to ]*${RE_STR_WITH_QUOTE}`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(reExp) {
    return webtestDriver.waitUntil('titleMatches', new RegExp(reExp));
  }
};
