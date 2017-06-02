'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"

/**
 * e.g. find element .foo.bar
 *      find element #my-id
 */
module.exports = {
  name: 'find element',
  help: 'fine element <selector>',
  regExp: new RegExp(`^find element ${RE_STR}$`),
  func:
    /** must return a Promise, so that it can be chained with next command*/
    function(selector) {
      if (selector) {
        seleniumWebTestDriver.driver.sleep(100); //To prevent stale element error
        return seleniumWebTestDriver.findBy('css', selector, false);
      }
    }
};
