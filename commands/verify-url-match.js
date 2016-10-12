'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR_WITH_QUOTE = '[\'"]([\\s\\S]+)[\'"]'; //e.g. 'foo bar', "foo bar"

module.exports = {
  name: 'verify url match',
  help: 'verify url matches <string>',
  regExp: new RegExp(`^verify url matches ${RE_STR_WITH_QUOTE}`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(string) {
    return seleniumWebTestDriver.driver.wait( function() {
      return seleniumWebTestDriver.driver.executeScript('return window.location.href')
        .then(resp => resp.match(new RegExp(string)));
    }, seleniumWebTestDriver.config.timeout);
  }
};

