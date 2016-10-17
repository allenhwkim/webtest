'use strict';
var seleniumWebTestDriver = require('../src/selenium-web-test-driver');
const RE_STR  = '["]?([^\"]+)["]?'; // e.g. foo.bar, "foo.bar", or "foo bar"

/**
 * e.g. click .foo.bar
 *    click #my-id
 */
module.exports = {
  name: 'show element',
  help: 'show element <selector>',
  regExp: new RegExp(`^show element ${RE_STR}$`),
  func:
    /** must return a Promise, so that it can be chained with next command*/
    function(selector) {
      return seleniumWebTestDriver.findBy('css', selector)
        .then(element => {
          seleniumWebTestDriver.lastFoundElement = element;
          element.getOuterHtml().then(html => console.log(html));
        });
    }
};
