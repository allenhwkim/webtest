'use strict';
var webtestDriver = require('../src/web-test-driver');
var retry = require('../src/webdriverjs-retry');
const RE_SELECTOR  = '[\'"]([\\s\\S]+)[\'"]'; //e.g. 'foo bar', "foo bar"

module.exports = {
  name: 'mouse down on a specific element',
  help: 'mouse down on <element>',
  regExp: new RegExp(`^mouse down on element ${RE_SELECTOR}`),
  func: /** must return a Promise, so that it can be chained with next command*/
    function(selector) {
      webtestDriver.driver.sleep(100); //To prevent stale element error
      var fn = () => {
        webtestDriver.findBy('css', selector)
          .then(element => webtestDriver.driver.actions().mouseMove(element).mouseDown().perform());
      };
      return retry.run(fn, 5000, 200);
    }
};
