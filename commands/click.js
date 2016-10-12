'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR  = '[ ]?([\\S]+)?'; // e.g. foo.bar, "foo.bar", or 'foo.bar'. not "foo bar"

/**
 * e.g. click
 *      click .foo.bar
 *      click #my-id
 */
module.exports = {
  name: 'click',
  help: 'click <selector>',
  regExp: new RegExp(`^click[ ]?${RE_STR}`),
  func:
    /** must return a Promise, so that it can be chained with next command*/
    function(selector) {
      if (selector) {
        return seleniumWebTestDriver.findBy('css', selector)
          .then(element => element.click());
      } else if (seleniumWebTestDriver.lastFoundElement) {
        let lastFoundElement = seleniumWebTestDriver.lastFoundElement;
        return lastFoundElement.click();
      } else {
        throw "There is no element to click";
      }
   }
};
