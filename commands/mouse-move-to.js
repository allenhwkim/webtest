'use strict';
var webtestDriver = require('../src/web-test-driver');
var retry = require('../src/webdriverjs-retry');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"

module.exports = {
  name: 'move mouse to',
  help: 'move mouse to <selector>',
  regExp: new RegExp(`^move mouse to ${RE_STR}`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function(selector) {
      webtestDriver.driver.sleep(100); //To prevent stale element error
      var fn = () => {
        webtestDriver.findBy('css', selector)
          .then(element => webtestDriver.driver.actions().mouseMove(element).perform());
      };
      return retry.run(fn, 5000, 200);
    }
};