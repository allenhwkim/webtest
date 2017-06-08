'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
var retry = require('webdriverjs-retry');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"

/**
 * e.g. click .foo.bar
 *      click #my-id
 */
module.exports = {
  name: 'click element',
  help: 'click <selector>',
  regExp: new RegExp(`^click ${RE_STR}$`),
  func:
    /** must return a Promise, so that it can be chained with next command*/
    function(selector) {
      seleniumWebTestDriver.driver.sleep(100); //To prevent stale element error
      var fn = () => {
        seleniumWebTestDriver.findBy('css', selector)
          .then(element => element.click());
      };
      return retry.run(fn, 5000, 200);
    }
};
