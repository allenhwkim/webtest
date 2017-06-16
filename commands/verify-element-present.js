'use strict';
var webtestDriver = require('../src/web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"

module.exports = {
  name: 'verify element present',
  help: 'verify element <selector> present',
  regExp: new RegExp(`^verify element ${RE_STR} [is ]*present`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function(selector) {
      selector = selector.replace(/ is/g,'');
      return webtestDriver.driver.wait(function () {
        return webtestDriver.driver.findElements({css: selector})
          .then(listOfEl => listOfEl.length !== 0 );
      }, webtestDriver.config.timeout);
    }
};
