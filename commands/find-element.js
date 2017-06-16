'use strict';
var webtestDriver = require('../src/web-test-driver');
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
        webtestDriver.driver.sleep(100); //To prevent stale element error
        return webtestDriver.findBy('css', selector, false);
      }
    }
};
