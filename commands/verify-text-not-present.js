'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_STR_WITH_QUOTE = '[\'"]([\\s\\S]+)[\'"]'; //e.g. 'foo bar', "foo bar"

module.exports = {
  name: 'verify text not present',
  help: 'verify text "<text>" not present',
  regExp: new RegExp(`^verify text ${RE_STR_WITH_QUOTE} [is ]*not present`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function(string) {
      return webtestDriver.driver.wait(function () {
        return webtestDriver.driver.getPageSource()
          .then(function (source) {
            return (source.indexOf(string) === -1);
          });
      }, webtestDriver.config.timeout);
    }
};
