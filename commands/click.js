'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
var retry = require('webdriverjs-retry');
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
      if (seleniumWebTestDriver.lastFoundElement) {
        let lastFoundElement = seleniumWebTestDriver.lastFoundElement;
        var fn = () => lastFoundElement.click();
        return retry.run(fn, 5000, 200);
      } else {
        throw "There is no element to click";
      }
   }
};
