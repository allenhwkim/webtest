'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR_WITH_QUOTE = '[\'"]([\\s\\S]+)[\'"]'; //e.g. 'foo bar', "foo bar"

module.exports = {
  name: 'verify text not present',
  help: 'verify text "<text>" not present',
  regExp: new RegExp(`^verify text ${RE_STR_WITH_QUOTE} not present`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function(string) {
      return seleniumWebTestDriver.driver.wait(function () {
        return seleniumWebTestDriver.driver.getPageSource()
          .then(function (source) {
            return (source.indexOf(string) === -1);
          });
      }, seleniumWebTestDriver.config.timeout);
    }
};
