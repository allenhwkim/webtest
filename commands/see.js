'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR_WITH_QUOTE = '[\'"]([\\s\\S]+)[\'"]'; //e.g. 'foo bar', "foo bar"

/**
 * e.g. see 'Hello World'
 */
module.exports = {
  name: 'see',
  help: 'see "<text>"',
  regExp: new RegExp(`^see ${RE_STR_WITH_QUOTE}`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function(string) {
      let xpath = `//*[contains(., '${string}')][not(.//*[contains(., '${string}')])]`;
      return seleniumWebTestDriver.findBy('xpath', xpath);
    }
};
