'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_STR_WITH_QUOTE = '[\'"]([\\s\\S]+)[\'"]'; //e.g. 'foo bar', "foo bar"

module.exports = {
  name: 'verify url match',
  help: 'verify url matches <string>',
  regExp: new RegExp(`^verify url matches [to ]*${RE_STR_WITH_QUOTE}`),
  /** must return a Promise, so that it can be chained with next command*/
  func: function(string) {
    return webtestDriver.driver.wait( function() {
      return webtestDriver.driver.executeScript('return window.location.href')
        .then(resp => resp.match(new RegExp(string)));
    }, webtestDriver.config.timeout);
  }
};

