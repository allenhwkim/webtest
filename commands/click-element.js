'use strict';
var webtestDriver = require('../src/web-test-driver');
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
      webtestDriver.driver.sleep(100); //To prevent stale element error
      var fn = () => {
        webtestDriver.findBy('css', selector)
          .then(element => element.click());
      };
      return retry.run(fn, 5000, 200);
    }
};
