'use strict';
var webtestDriver = require('../src/web-test-driver');
var retry = require('../src/webdriverjs-retry');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"

/**
 * e.g. click
 */
module.exports = {
  name: 'click',
  help: 'click',
  regExp: new RegExp(`^click$`),
  func:
    /** must return a Promise, so that it can be chained with next command*/
    function(selector) {
      if (webtestDriver.lastFoundElement) {
        let lastFoundElement = webtestDriver.lastFoundElement;
        var fn = () => lastFoundElement.click();
        return retry.run(fn, 5000, 200);
      } else {
        throw "There is no element to click";
      }
   }
};
