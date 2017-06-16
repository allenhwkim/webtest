'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_STR_WITH_QUOTE = '[\'"]([\\s\\S]+)[\'"]'; //e.g. 'foo bar', "foo bar"

module.exports = {
  name: 'verify text present',
  help: 'verify text "<text>" present',
  regExp: new RegExp(`^verify text ${RE_STR_WITH_QUOTE} [is ]*present`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function(string) {
      return webtestDriver.driver.wait(function () {
        // investigate this, http://stackoverflow.com/a/19360765/454252
        // and this http://stackoverflow.com/a/24288779/454252
        return webtestDriver.driver.findElement({css: "body"}).getText()
          .then(function (text) {
            return (text.indexOf(string) > -1);
          });
      }, webtestDriver.config.timeout);
    }
};
